'use strict'

const { authSchema } = require('../../../src/schemas/auth')
const { buildAuthParams } = require('../../utils/generate')

describe('authSchema', () => {
  test('valid params should pass', async () => {
    await expect(authSchema.validate(buildAuthParams)).resolves.not.toThrow()
  })

  test('email is required', async () => {
    const params = buildAuthParams({ email: undefined })
    await expect(authSchema.validate(params)).rejects.toThrow(/email is a required field/)
  })

  test('email should be a valid email', async () => {
    const params = buildAuthParams({ email: 'foo' })
    await expect(authSchema.validate(params)).rejects.toThrow(/email must be a valid email/)
  })

  test('password is required', async () => {
    const params = buildAuthParams({ password: undefined })
    await expect(authSchema.validate(params)).rejects.toThrow(/password is a required field/)
  })
})
