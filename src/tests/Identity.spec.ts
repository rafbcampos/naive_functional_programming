import { identity } from '../Identity'

// Testing Laws:

const f = (x: number) => x * 10
const g = (x: number) => x - 10
const id = (x: any) => x

// Composition

const compositionTest =
	identity(10)
		.map(f)
		.map(g)
		.inspect() ===
	identity(10)
		.map(x => g(f(x)))
		.inspect()

// Identity

const identityTest =
	identity(10)
		.map(id)
		.inspect() === identity(10).inspect()

// Chain & Fold:

const extendedMethodsTest =
	identity(10)
		.chain(n => identity(n + 10))
		.fold(id) === 20

describe('Identity', () => {
	it('should preserve composition', () => {
		expect(compositionTest).toBe(true)
	})
	it('should preserve identity', () => {
		expect(identityTest).toBe(true)
	})
	it('should chain and fold correctly', () => {
		expect(extendedMethodsTest).toBe(true)
	})
})
