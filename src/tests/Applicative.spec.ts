import { identity } from '../Identity'
import { applicative } from '../Applicative'

const add10 = (x: number) => x + 10

const three = identity(3)

const id = (x: any) => x

// Composition

const compositionTest =
	three.map(add10).inspect() ===
	applicative(add10)
		.ap(three)
		.inspect()

// Identity

const identityTest =
	applicative(id)
		.ap(three)
		.inspect() === three.inspect()

describe('Applicative', () => {
	it('should preserve composition', () => {
		expect(compositionTest).toBe(true)
	})
	it('should preserve identity', () => {
		expect(identityTest).toBe(true)
	})
})
