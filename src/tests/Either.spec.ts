import { either } from '../Either'

// Testing Laws:

const f = (x: number) => x * 10
const g = (x: number) => x - 10
const id = (x: any) => x

// Composition

const compositionTestRight =
	either<string, number>(undefined, 10)
		.map(f)
		.map(g)
		.inspect() ===
	either<string, number>(undefined, 10)
		.map(x => g(f(x)))
		.inspect()

const compositionTestLeft =
	either<string, number>('error')
		.map(f)
		.map(g)
		.inspect() ===
	either<string, number>('error')
		.map(x => g(f(x)))
		.inspect()

// Identity

const identityTestRight =
	either<string, number>(undefined, 10)
		.map(id)
		.inspect() === either<string, number>(undefined, 10).inspect()

const identityTestLeft =
	either<string, number>('error')
		.map(id)
		.inspect() === either<string, number>('error').inspect()

// Chain & Fold:

const extendedMethodsTestRight =
	either<string, number>(undefined, 10)
		.chain(n => either<string, number>(undefined, n + 10))
		.fold(id, id) === 20

const extendedMethodsTestLeft =
	either<string, number>('error')
		.chain(n => either<string, number>(undefined, n + 10))
		.fold(id, id) === 'error'

describe('Either', () => {
	it('should preserve composition', () => {
		expect(compositionTestRight).toBe(true)
		expect(compositionTestLeft).toBe(true)
	})
	it('should preserve identity', () => {
		expect(identityTestRight).toBe(true)
		expect(identityTestLeft).toBe(true)
	})
	it('should chain and fold correctly', () => {
		expect(extendedMethodsTestRight).toBe(true)
		expect(extendedMethodsTestLeft).toBe(true)
	})
})
