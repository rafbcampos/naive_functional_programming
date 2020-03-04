import { reader } from '../Reader'
// Testing Laws:

const config = { env: 'development' }
type Config = typeof config
const withConfig = (c: Config): [Config, number] => [
	c,
	c.env === 'development' ? 10 : 0,
]
const f = (x: number) => x * 10
const g = (x: number) => x - 10
const id = (x: any) => x

// Composition

const compositionTest =
	JSON.stringify(
		reader<Config, number>(withConfig)
			.map(f)
			.map(g)
			.addConfig(config)
	) ===
	JSON.stringify(
		reader<Config, number>(withConfig)
			.map(x => g(f(x)))
			.addConfig(config)
	)

// Identity

const identityTest =
	JSON.stringify(
		reader<Config, number>(withConfig)
			.map(id)
			.addConfig(config)
	) === JSON.stringify(reader<Config, number>(withConfig).addConfig(config))

// Chain & Fold:
const r1 = reader<Config, number>(withConfig)
const r2 = (a: number) => reader<Config, number>(c => [c, a + 10])
const r3 = (b: number) => reader<Config, number>(c => [c, b + 10])

// value: 10 -> 20 -> 30

const [c, value] = r1
	.chain(r2)
	.chain(r3)
	.addConfig(config)

const chainTest = JSON.stringify(c) === JSON.stringify(config) && value === 30

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
