import { Either, either } from "./Either";
import { Identity, identity } from "./Identity";

export const exist = (x: any) => x !== undefined && x !== null;

export const fromNullable = <A>(x?: A): Either<undefined, A> =>
  exist(x)
    ? either({ tag: "right", value: x as A })
    : either({ tag: "left", value: undefined });

export const tryCatch = <A, B>(fn: (arg: A) => B, arg: A): Either<Error, B> => {
  try {
    return either<Error, B>({ tag: "right", value: fn(arg) });
  } catch (error) {
    return either<Error, B>({ tag: "left", value: error });
  }
};

// Traverse an array of Identities:
export const traverse = <T>(ar: Identity<T>[]): Identity<T[]> =>
  identity(ar.map(i => i.fold(x => x)));

// Natural transformations:
export const identityToEither = <A>(i: Identity<A>) =>
  i.fold(x => either<undefined, A>({ tag: "right", value: x }));
