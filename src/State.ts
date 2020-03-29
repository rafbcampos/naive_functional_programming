export const URI = "State";

export interface State<S, A> {
  runWith: (s: S) => [S, A];
  chain: <B>(st: (a: A) => State<S, B>) => State<S, B>;
  map: <B>(f: (a: A) => B) => State<S, B>;
  inspect: () => string;
}

export const state = <S, A>(f: (s: S) => [S, A]): State<S, A> => ({
  runWith: (s: S) => f(s),
  chain<B>(st: (a: A) => State<S, B>) {
    return state<S, B>(s1 => {
      const [s2, a] = this.runWith(s1);
      return st(a).runWith(s2);
    });
  },
  map<B>(f: (a: A) => B) {
    return state<S, B>(s1 => {
      const [s2, a] = this.runWith(s1);
      return [s2, f(a)];
    });
  },
  inspect: () => "State"
});

declare module "./HKT" {
  interface URI2HKT2<A, B> {
    State: State<A, B>;
  }
}
