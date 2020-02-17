import { Identity } from './Identity'

// Value is a function:
export const applicative1 = <A, B>(value: (x: A) => B) => ({
	ap: (x: Identity<A>) => x.map(value),
})

// Currying A => B => C:
export const applicative2 = <A, B, C>(value: (x: A) => (y: B) => C) => ({
	ap: (x: A) => applicative1(value(x)),
})

// Currying A => B => C => D:
export const applicative3 = <A, B, C, D>(
	value: (x: A) => (y: B) => (z: C) => D
) => ({
	ap: (x: A) => applicative2(value(x)),
})
