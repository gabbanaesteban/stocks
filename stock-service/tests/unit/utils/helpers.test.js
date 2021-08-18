'use strict'

const helpers = require('../../../src/utils/helpers')
const { BadRequest } = require('http-errors')

describe('validateParams()', () => {
  let params
  let schema
  let options

  beforeEach(() => {
    params = {}
    schema = { validate: jest.fn() }
    options = { abortEarly: false, foo: 'bar' }
  })

  test('should be able to override options', async () => {
    await helpers.validateParams(params, schema, options)

    expect(schema.validate).toHaveBeenCalledWith(params, expect.objectContaining(options))
  })

  test('should throw a BadRequest error with error message', async () => {
    const errorMessage = 'This is a validation Error'

    schema = { validate: jest.fn(() => Promise.reject({ errors: [errorMessage] })) }

    await expect(helpers.validateParams(params, schema, options)).rejects.toThrow(BadRequest)
    await expect(helpers.validateParams(params, schema, options)).rejects.toThrow(errorMessage)
  })

  test('should return the params from validation if no error is found', async () => {
    schema = { validate: jest.fn(() => Promise.resolve(params)) }

    const result = await helpers.validateParams(params, schema, options)

    expect(result).toEqual(await schema.validate.mock.results[0].value)
    expect(schema.validate).toHaveBeenCalledWith(params, expect.objectContaining(options))
  })
})
