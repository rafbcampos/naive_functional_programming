import { URIS, HKT } from './HKT'

// Applicatives for Functor<A>:

export interface Applicative<A, B> {
	ap: <F extends URIS>(fa: HKT<F, A>) => HKT<F, B>
}

export interface ApplicativeC2<A, B, C> {
	ap: <F extends URIS>(fa: HKT<F, A>) => Applicative<B, C>
}

export interface ApplicativeC3<A, B, C, D> {
	ap: <F extends URIS>(fa: HKT<F, A>) => ApplicativeC2<B, C, D>
}

export const applicative = <A, B>(value: (x: A) => B): Applicative<A, B> => ({
	ap: <F extends URIS>(fa: HKT<F, A>) => fa.map(value),
})

export const applicative2 = <A, B, C>(
	value: (x: A) => (y: B) => C
): ApplicativeC2<A, B, C> => ({
	ap: <F extends URIS>(fa: HKT<F, A>) => applicative<B, C>(fa.fold(value)),
})

export const applicative3 = <A, B, C, D>(
	value: (x: A) => (y: B) => (z: C) => D
): ApplicativeC3<A, B, C, D> => ({
	ap: <F extends URIS>(fa: HKT<F, A>) => applicative2<B, C, D>(fa.fold(value)),
})
