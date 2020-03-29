import { either } from "../Either";
import { applicative2 } from "../Applicative2";

const add10 = (x: number) => x + 10;

const three = either<string, number>({ tag: "right", value: 3 });
const error = either<string, number>({ tag: "left", value: "Error" });

const id = (x: any) => x;

// Composition

const compositionTest1 =
  three.map(add10).inspect() ===
  applicative2(add10)
    .ap(three)
    .inspect();

const compositionTest2 =
  error.map(add10).inspect() ===
  applicative2(add10)
    .ap(error)
    .inspect();

// Identity

const identityTest1 =
  applicative2(id)
    .ap(three)
    .inspect() === three.inspect();

const identityTest2 =
  applicative2(id)
    .ap(error)
    .inspect() === error.inspect();

describe("ApplicativeV2", () => {
  it("should preserve composition", () => {
    expect(compositionTest1).toBe(true);
    expect(compositionTest2).toBe(true);
  });
  it("should preserve identity", () => {
    expect(identityTest1).toBe(true);
    expect(identityTest2).toBe(true);
  });
});
