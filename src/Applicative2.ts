import { HKT2, URIS2 } from './HKT'

// Applicatives for Functors<E|A>:
// V2 stands for two values and C[N] for the number of curried arguments:

export interface Applicative2<A, B> {
	ap: <F extends URIS2, L>(fea: HKT2<F, L, A>) => HKT2<F, L, B>
}

export interface Applicative2C2<A, B, C> {
	ap: <F extends URIS2, L>(fea: HKT2<F, L, A>) => Applicative2<B, C>
}

export interface Applicative2C3<A, B, C, D> {
	ap: <F extends URIS2, L>(fea: HKT2<F, L, A>) => Applicative2C2<B, C, D>
}

const id = (x: any) => x

export const applicative2 = <A, B>(value: (x: A) => B): Applicative2<A, B> => ({
	ap: <F extends URIS2, L>(fea: HKT2<F, L, A>) => fea.map(value),
})

export const applicative2C2 = <A, B, C>(
	value: (x: A) => (y: B) => C
): Applicative2C2<A, B, C> => ({
	ap: <F extends URIS2, L>(fea: HKT2<F, L, A>) =>
		applicative2<B, C>(fea.fold(id, value)),
})

export const applicativeV2C3 = <A, B, C, D>(
	value: (x: A) => (y: B) => (z: C) => D
): Applicative2C3<A, B, C, D> => ({
	ap: <F extends URIS2, L>(fea: HKT2<F, L, A>) =>
		applicative2C2<B, C, D>(fea.fold(id, value)),
})
