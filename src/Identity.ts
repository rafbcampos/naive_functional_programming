export const URI = 'Identity'

export interface Identity<A> {
	map: <B>(f: (x: A) => B) => Identity<B>
	chain: <B>(f: (x: A) => Identity<B>) => Identity<B>
	fold: <B>(f: (x: A) => B) => B
	inspect: () => string
}

export const identity = <A>(value: A): Identity<A> => ({
	map: <B>(f: (x: A) => B) => identity<B>(f(value)),
	chain: <B>(f: (x: A) => Identity<B>) => f(value),
	fold: <B>(f: (x: A) => B) => f(value),
	inspect: () => `Identity(${value})`,
})

declare module './HKT' {
	interface URI2HKT<A> {
		Identity: Identity<A>
	}
}
