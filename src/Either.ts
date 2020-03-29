import { match } from "typescript-pattern-matching";

export const URI = "Either";

type EitherValue<L, R> = { tag: "left"; value: L } | { tag: "right"; value: R };

export interface Right<L, R> {
  map: <B>(f: (x: R) => B) => Right<L, B>;
  chain: <B>(f: (x: R) => Right<L, B>) => Right<L, B>;
  fold: <B, C>(onLeft: (x: L) => B, onRight: (x: R) => C) => B | C;
  inspect: () => string;
}

export interface Left<L, R> {
  map: <B>(f: (x: R) => B) => Left<L, B>;
  chain: <B>(f: (x: R) => Left<L, B>) => Left<L, B>;
  fold: <B, C>(onLeft: (x: L) => B, onRight: (x: R) => C) => B | C;
  inspect: () => string;
}

const right = <L, R>(value: R): Right<L, R> => ({
  map: <B>(f: (x: R) => B) => right<L, B>(f(value)),
  chain: <B>(f: (x: R) => Right<L, B>) => f(value),
  fold: <B, C>(onLeft: (x: L) => B, onRight: (x: R) => C) => onRight(value),
  inspect: () => `Right(${value})`
});

const left = <L, R>(value: L): Left<L, R> => ({
  map: <B>(_: (x: R) => B) => left<L, B>(value),
  chain: <B>(_: (x: R) => Right<L, B>) => left<L, B>(value),
  fold: <B, C>(onLeft: (x: L) => B, onRight: (x: R) => C) => onLeft(value),
  inspect: () => `Left(${value})`
});

export type Either<L, R> = Right<L, R> | Left<L, R>;

export const either = <L, R>(
  taggedValue: EitherValue<L, R>
): Left<L, R> | Right<L, R> =>
  match<EitherValue<L, R>, Right<L, R> | Left<L, R>>(taggedValue)
    .with({ tag: "left" }, ({ tag, value }) => left<L, R>(value))
    .with({ tag: "right" }, ({ tag, value }) => right<L, R>(value))
    .run();

declare module "./HKT" {
  interface URI2HKT2<A, B> {
    Either: Either<A, B>;
  }
}
