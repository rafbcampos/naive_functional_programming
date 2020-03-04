import { state } from '../State'
// Testing Laws:

const initialState = 10
const onState = (x: number): [number, number] => [x * x, x + 10]
const f = (x: number) => x * 10
const g = (x: number) => x - 10
const id = (x: any) => x

// Composition

const compositionTest =
	JSON.stringify(
		state<number, number>(onState)
			.map(f)
			.map(g)
			.runWith(initialState)
	) ===
	JSON.stringify(
		state<number, number>(onState)
			.map(x => g(f(x)))
			.runWith(initialState)
	)

// Identity

const identityTest =
	JSON.stringify(
		state<number, number>(onState)
			.map(id)
			.runWith(initialState)
	) === JSON.stringify(state<number, number>(onState).runWith(initialState))

// Chain & Fold:
const s1 = state<number, number>(onState)
const s2 = (a: number) => state<number, number>(x => [x + 10, a + 10])
const s3 = (b: number) => state<number, number>(x => [x * 10, b + 10])

// state: 10 -> 100 -> 110 -> 1100
// value: 10 -> 20 -> 30 -> 40

const [st, value] = s1
	.chain(s2)
	.chain(s3)
	.runWith(initialState)

const chainTest = st === 1100 && value === 40

describe('State', () => {
	it('should preserve composition', () => {
		expect(compositionTest).toBe(true)
	})
	it('should preserve identity', () => {
		expect(identityTest).toBe(true)
	})
	it('should chain correctly', () => {
		expect(chainTest).toBe(true)
	})
})
