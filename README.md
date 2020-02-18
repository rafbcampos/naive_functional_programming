# A naive approach to functional programming

I'm trying to learn functional programming, and that could be quite overwhelming.

Search for functional programming often results in a bunch of unreadable lingoes (for me at least), articles trying to wrap the F-word in new names like 'mappable', or people that do not understand it, but are writing tutorials either way.

**That isn't what I'm trying to do here. What I'm doing is learn in public.**

## Some real functional programming content

First, and that is worth even if you do not keep reading to the end, check this out:

- [Professor Frisby Introduces Composable Functional JavaScript by Brian Lonsdorf](https://egghead.io/courses/professor-frisby-introduces-composable-functional-javascript) - This is an incredible free course, and is the source of most of the stuff you are going to see here, so do a favor to yourself and watch it.

- [Category Theory by Bartosz Milewski](https://www.youtube.com/watch?v=I8LbkfSSR58&list=PLbgaMIhjbmEnaH_LTkxLI7FMa2HsnawM_) - If you're feeling adventurous and want to discover the crazy world of the Category Theory, watch this series of videos (I'm watching for the second time, and probably I'll need at least one more, but worth it).

Now that I pointed you to people who know what they're talking about, I'm free to throw here that stuff that is in my head while I'm trying to figure that out.

## What?! Why?!

As far as I understand, Category Theory is a way to try to structure things through abstraction.

Instead of walking in the streets trying to draw a map, we use a satellite picture for that.

We have these **objects** and the **relations** between them, and we're forbidden to look into the objects (not because we want to punish ourselves, but to create structures that serve to more than one type of category), so **all our assertions need to be inferred from those relations, called morphisms**.

> Let's stop right there. Why in the earth I need to engage in this math theory?! I'm not trying to understand the entire world through math. I want to become a better programmer.

Ok, I'm with you on that. But do you remember that those math guys have this constraint of only seeing things through their relations? If you take **types as a Category and function as morphisms**, you end up with a bunch of knowledge on how to deal with functions and can apply that to make your code better. I'm talking about **composition and predictability**.

So the main goal is to write **code that is predictable and easy to reason about**, and we can get that if we fit our functions and data structures into the Category Theory laws.

## Tools

First, we need to use **pure functions**.

There is a bunch of rules to check a function as pure, but I'll stick with: **referential transparency**, that translates to I can swap my function invocation for the value it returns, like a lookup table. So, for that, no global variables, no side effects.

> I knew it! I work with Web Apps, my life is side effects: DOM manipulation, users inputs, Ajax calls, are you crazy?!

Relax, take a deep breath 🧘‍♂️. We'll continue to do all that, believe in me.

Also, we need **currying** that's a **partial application** where the end function always expect one argument (function arity 1). Languages like Haskel have that into it, but with JS we need to create or use a lib for that.

Ok, but there are more than pure functions. I'll throw a bunch of **loose definitions** here, so we can feel more comfortable when I talk Category Theory terms (and of course, it's valid to remember that's what I got about them):

- Functors = Container for a value that implements a `map` (not related to iteration, but applying a function on its value) **preserving composition** (`F(x).map(f).map(g) === F(x).map(g(f(x)))`) and **identity** (`F(x).map(x => x) = F(x)`).

- Pointed Functors = Functor that implements an `of` method (that is a way to throw a value inside our container).

- Applicative Functors = Functor that implements the method `ap` (apply the value of one container on the value of another container, remember, the value can be a function).

- Semigroups = A container that implements a `concat` method that is **associativity**, that means `'Hello' + ('World' + '!') = ('Hello' + 'World') + '!'`

- Monoids = It's a semigroup that has an `empty` method. In other words, it's safe to work no matter the number of elements: `empty string + 'all fine' = 'all fine'` no errors in our dear console.

- Monads = Is a pointed functor that implements a `flatMap` or `chain` method (instead of nested Monads, it'll return a unidimensional Monad);

- Natural transformation = FunctorA(value) => FunctorB(value)

- Isomorphism = You can change from a type to another and vice-versa without losing information.

I already can see people coming with torches and forks, to punish me for all the nonsense that I put here. But hold your horses. **That's a living document from my learning process, and that's what I get so far**.

> Ok, ok. But I'm starting to loose my interest. Can we see some code? I want to check how to implement all of that!

Fair enough. Let's move on.

## Identity Functor

Have you ever saw those Category Theory diagrams, where there is a dot, and an arrow that goes from that dot to itself?

Those are identity functors. In our case, where our category is a set of types, they're endofunctors (because they map to the same set).

> Ok, but why would I be interested in such a thing, a functor that maps to itself?

Because that's our **ticket for the marvelous world of composition**.

We're going to put our value inside this container (functor) and use its `map` method to apply a function on its value and then return another functor to keep that going, till we finish with our operations and redeem our result using `fold`.

First, let's define our Identity Functor:

```typescript
interface Identity<A> {
	map: <B>(f: (x: A) => B) => Identity<B>
	chain: <B>(f: (x: A) => Identity<B>) => Identity<B>
	fold: <B>(f: (x: A) => B) => B
	inspect: () => string
}

const identity = <A>(value: A): Identity<A> => ({
	map: <B>(f: (x: A) => B) => identity<B>(f(value)),
	chain: <B>(f: (x: A) => Identity<B>) => f(value),
	fold: <B>(f: (x: A) => B) => f(value),
	inspect: () => `Identity(${value})`,
})
```

There are five methods here:

- **map**: We apply a function to our value and put the result back in a functor to keep composing.
- **chain**: Imagine that the function that you want to `map` returns another `Identity`. In that case, we'll end up with `Identity(Identity(value))`. Chain flat that, resulting in a single `Identity(value)`.
- **fold**: It's tough, but sooner or later, our value needs to leave the cozy and secure functor.
- **inspect**: Friendly console.

> Wait a minute. You said five methods, but there are only four here!

Yeap, the `identity` call has the same effect of the `of` method, that is the way to insert the value inside our functor.

## Either

And how about conditional constructs and error handler? Can functional programming improve that aspect of coding?

Yes, it can!

In this [talk](https://www.youtube.com/watch?v=E8I19uA-wGY) Scott Wlaschin uses this Railway Track model:

![Railway Track Model](https://res.cloudinary.com/alohawav/image/upload/v1581997913/railwayTrackModel_jfnynj.png)

Here we have functions that can return two different things, and we have a functor that can help us with that called Either:

```typescript
interface Either<L, R> {
	map: <B>(f: (x: R) => B) => Either<L, B>
	chain: <B, C>(f: (x: R) => Either<B, C>) => Either<L, R> | Either<B, C>
	fold: <B, C>(onLeft: (x: L) => B, onRight: (x: R) => C) => B | C
	inspect: () => string
}

const either = <L, R>(left?: L, right?: R): Either<L, R> => ({
	map: <B>(f: (x: R) => B) =>
		exist(right) ? either<L, B>(undefined, f(right as R)) : either<L, B>(left),
	chain: <B, C>(f: (x: R) => Either<B, C>) =>
		exist(right) ? f(right as R) : either<L, R>(left),
	fold: <B, C>(onLeft: (x: L) => B, onRight: (x: R) => C) =>
		exist(right) ? onRight(right as R) : onLeft(left as L),
	inspect: () => (exist(right) ? `Right(${right})` : `Left(${left})`),
})
```

That serves to handle errors, with some pops up, we skip the other steps in our chain. But also for skipping unnecessary computation, imagine that we have three predicates, but we only need one to be true to pass to the next step. If the first one returns true, we don't need to compute the next two, we skip them and move on in our pipe.

## Applicative

I want to go rad and put our curried functions in our pipeline. However, I don't want to `fold` just for that.

To do so, I need to apply functors to functors:
`F(x => x + 10) -> F(10) = F(20)`.

In the end, we need a method `ap` in a Functor containing a function as value and call that passing another Functor with our expect argument into it:
`ap: (functor) => functor.map(value)`

A pointed functor with an `ap` method is called **applicative functor**.

Typing that with TypeScript end up being impossible for me (TypeScript does not have higher-kinded types like Haskel, and I got lost within so many letters using HKT like in [fp-ts](https://github.com/gcanti/fp-ts)), so I cheated a little bit:

```typescript
interface Applicative<A, B> {
	ap: (i: Identity<A>) => Identity<B>
}

interface Applicative2<A, B, C> {
	ap: (i: Identity<A>) => Applicative<B, C>
}

interface Applicative3<A, B, C, D> {
	ap: (i: Identity<A>) => Applicative2<B, C, D>
}

const applicative = <A, B>(value: (x: A) => B): Applicative<A, B> => ({
	ap: (i: Identity<A>) => i.map(value),
})

const applicative2 = <A, B, C>(
	value: (x: A) => (y: B) => C
): Applicative2<A, B, C> => ({
	ap: (i: Identity<A>) => applicative<B, C>(i.fold(value)),
})

const applicative3 = <A, B, C, D>(
	value: (x: A) => (y: B) => (z: C) => D
): Applicative3<A, B, C, D> => ({
	ap: (i: Identity<A>) => applicative2<B, C, D>(i.fold(value)),
})
```

## TBD

Work in progress...

## Contributing

1.  Fork it!
2.  Create your feature branch: git checkout -b my-new-feature
3.  Commit your changes: git commit -am 'Add some feature'
4.  Push to the branch: git push origin my-new-feature
5.  Submit a pull request :D

## License

The MIT License (MIT)

Copyright (c) 2020 Rafael Campos

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
