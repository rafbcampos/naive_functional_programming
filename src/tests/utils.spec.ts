import { tryCatch, fromNullable, identityToEither, traverse } from '../utils'
import { identity } from '../Identity'

const errorMessage = 'Zero is not a valid divisor'

const divide10By = (x: number) => {
	if (x === 0) throw errorMessage
	return 10 / x
}

const traverseTest =
	traverse([identity(1), identity(2), identity(3)]).inspect() ===
	identity([1, 2, 3]).inspect()

// Natural transformation:
const ntLaw =
	identityToEither(identity(10))
		.map(x => x * x)
		.inspect() === identityToEither(identity(10).map(x => x * x)).inspect()

describe('fromNullable', () => {
	it('should return an Either<undefined, string>', () => {
		expect(fromNullable().inspect()).toBe(`Left(undefined)`)
		expect(fromNullable(10).inspect()).toBe(`Right(10)`)
	})
})

describe('tryCatch', () => {
	it('should return an Either<Error, number>', () => {
		expect(tryCatch(divide10By, 0).inspect()).toBe(`Left(${errorMessage})`)
		expect(tryCatch(divide10By, 10).inspect()).toBe('Right(1)')
	})
})

describe('traverse', () => {
	it('should return an Identity<T[]>', () => {
		expect(traverseTest).toBe(true)
	})
})

describe('Natural transformation: identityToEither', () => {
	it('should respect the nt law', () => {
		expect(ntLaw).toBe(true)
	})
})
