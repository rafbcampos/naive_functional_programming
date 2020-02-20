import { URIS, HKT } from './HKT'

export interface Applicative<A, B> {
	ap: <F extends URIS>(fab: HKT<F, A>) => HKT<F, B>
}

export interface Applicative2<A, B, C> {
	ap: <F extends URIS>(fab: HKT<F, A>) => Applicative<B, C>
}

export interface Applicative3<A, B, C, D> {
	ap: <F extends URIS>(fab: HKT<F, A>) => Applicative2<B, C, D>
}

export const applicative = <A, B>(value: (x: A) => B): Applicative<A, B> => ({
	ap: <F extends URIS>(fab: HKT<F, A>) => fab.map(value),
})

export const applicative2 = <A, B, C>(
	value: (x: A) => (y: B) => C
): Applicative2<A, B, C> => ({
	ap: <F extends URIS>(fab: HKT<F, A>) => applicative<B, C>(fab.fold(value)),
})

export const applicative3 = <A, B, C, D>(
	value: (x: A) => (y: B) => (z: C) => D
): Applicative3<A, B, C, D> => ({
	ap: <F extends URIS>(fab: HKT<F, A>) =>
		applicative2<B, C, D>(fab.fold(value)),
})
