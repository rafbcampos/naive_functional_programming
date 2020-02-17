import { exist } from './utils'

export interface Either<L, R> {
	map: <B>(f: (x: R) => B) => Either<L, B>
	chain: <B, C>(f: (x: R) => Either<B, C>) => Either<L, R> | Either<B, C>
	fold: <B, C>(onLeft: (x: L) => B, onRight: (x: R) => C) => B | C
	inspect: () => string
}

export const either = <L, R>(left?: L, right?: R): Either<L, R> => ({
	map: <B>(f: (x: R) => B) =>
		exist(right) ? either<L, B>(undefined, f(right as R)) : either<L, B>(left),
	chain: <B, C>(f: (x: R) => Either<B, C>) =>
		exist(right) ? f(right as R) : either<L, R>(left),
	fold: <B, C>(onLeft: (x: L) => B, onRight: (x: R) => C) =>
		exist(right) ? onRight(right as R) : onLeft(left as L),
	inspect: () => (exist(right) ? `Right(${right})` : `Left(${left})`),
})
