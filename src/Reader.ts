export const URI = "Reader";

export interface Reader<C, A> {
  addConfig: (c: C) => [C, A];
  chain: <B>(st: (a: A) => Reader<C, B>) => Reader<C, B>;
  map: <B>(f: (a: A) => B) => Reader<C, B>;
  inspect: () => string;
}

export const reader = <C, A>(f: (c: C) => [C, A]): Reader<C, A> => ({
  addConfig: (c: C) => f(c),
  chain<B>(r: (a: A) => Reader<C, B>) {
    return reader<C, B>(c => {
      const [_, a] = this.addConfig(c);
      return r(a).addConfig(c);
    });
  },
  map<B>(f: (a: A) => B) {
    return reader<C, B>(c => {
      const [_, a] = this.addConfig(c);
      return [c, f(a)];
    });
  },
  inspect: () => `Reader`
});

declare module "./HKT" {
  interface URI2HKT2<A, B> {
    Reader: Reader<A, B>;
  }
}
