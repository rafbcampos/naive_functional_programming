import { Either, either } from './Either'

export const exist = (x: any) => x !== undefined && x !== null

export const fromNullable = <A>(x?: A): Either<undefined, A> =>
	exist(x) ? either(undefined, x) : either(undefined)

export const tryCatch = <A, B>(fn: (arg: A) => B, arg: A): Either<Error, B> => {
	try {
		return either<Error, B>(undefined, fn(arg))
	} catch (error) {
		return either<Error, B>(error)
	}
}
