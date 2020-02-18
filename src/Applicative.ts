import { Identity } from 'src/Identity'

export interface Applicative<A, B> {
	ap: (i: Identity<A>) => Identity<B>
}

export interface Applicative2<A, B, C> {
	ap: (i: Identity<A>) => Applicative<B, C>
}

export interface Applicative3<A, B, C, D> {
	ap: (i: Identity<A>) => Applicative2<B, C, D>
}

export const applicative = <A, B>(value: (x: A) => B): Applicative<A, B> => ({
	ap: (i: Identity<A>) => i.map(value),
})

export const applicative2 = <A, B, C>(
	value: (x: A) => (y: B) => C
): Applicative2<A, B, C> => ({
	ap: (i: Identity<A>) => applicative<B, C>(i.fold(value)),
})

export const applicative3 = <A, B, C, D>(
	value: (x: A) => (y: B) => (z: C) => D
): Applicative3<A, B, C, D> => ({
	ap: (i: Identity<A>) => applicative2<B, C, D>(i.fold(value)),
})
