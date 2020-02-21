// Higher Kinded Types

// Unique type:
export interface URI2HKT<A> {}
export type URIS = keyof URI2HKT<any>
export type HKT<URI extends URIS, A> = URI2HKT<A>[URI]

// A | B:
export interface URI2HKT2<A, B> {}
export type URIS2 = keyof URI2HKT2<any, any>
export type HKT2<URI extends URIS2, A, B> = URI2HKT2<A, B>[URI]
