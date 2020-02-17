import { tryCatch, fromNullable } from '../utils'

const errorMessage = 'Zero is not a valid divisor'

const divide10By = (x: number) => {
	if (x === 0) throw errorMessage
	return 10 / x
}

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
