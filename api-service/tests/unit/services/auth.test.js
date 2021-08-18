'use strict'

const { NotFound, Unauthorized } = require('http-errors')
const jwt = require('jsonwebtoken')
const prismaMock = require('../../utils/mock-db')
const authService = require('../../../src/services/auth')
const { buildAuthParams, buildUser } = require('../../utils/generate')

beforeEach(() => jest.clearAllMocks())

test('signUp()', async () => {
  const { email, password } = buildAuthParams()
  const user = buildUser()

  const generateTokenSpy = jest.spyOn(authService, 'generateToken')

  prismaMock.user.create.mockResolvedValue(user)

  const result = await authService.signUp(email, password)

  expect(prismaMock.user.create).toHaveBeenCalledWith({ data: expect.objectContaining({ email }) })
  expect(generateTokenSpy).toHaveBeenCalledWith(user)
  expect(result).toHaveProperty('token', expect.stringContaining('.'))
})

describe('signIn()', () => {
  test('returns a token for the user', async () => {
    const authParams = buildAuthParams()
    const hashedPassword = await authService.hashPassword(authParams.password)
    const user = { id: Date.now(), email: authParams.email, password: hashedPassword }

    const generateTokenSpy = jest.spyOn(authService, 'generateToken')

    prismaMock.user.findFirst.mockResolvedValue(user)

    const result = await authService.signIn(authParams.email, authParams.password)

    expect(prismaMock.user.findFirst).toHaveBeenCalledWith({ where: { email: user.email } })
    expect(generateTokenSpy).toHaveBeenCalledWith(user)
    expect(result).toHaveProperty('token', expect.stringContaining('.'))
  })

  test('returns 404 error when user is not found', async () => {
    const authParams = buildAuthParams()

    const generateTokenSpy = jest.spyOn(authService, 'generateToken')
    const checkPasswordSpy = jest.spyOn(authService, 'checkPassword')

    prismaMock.user.findFirst.mockResolvedValue(undefined)

    await expect(authService.signIn(authParams.email, authParams.password)).rejects.toThrow(NotFound)

    expect(prismaMock.user.findFirst).toHaveBeenCalledWith({ where: { email: authParams.email } })
    expect(generateTokenSpy).not.toHaveBeenCalled()
    expect(checkPasswordSpy).not.toHaveBeenCalled()
  })

  test('returns 401 error when password does not match', async () => {
    const authParams = buildAuthParams()

    const generateTokenSpy = jest.spyOn(authService, 'generateToken')
    const checkPasswordSpy = jest.spyOn(authService, 'checkPassword')

    prismaMock.user.findFirst.mockResolvedValue(authParams)

    await expect(authService.signIn(authParams.email, authParams.password)).rejects.toThrow(Unauthorized)

    expect(prismaMock.user.findFirst).toHaveBeenCalledWith({ where: { email: authParams.email } })
    expect(checkPasswordSpy).toHaveBeenCalledTimes(1)
    expect(generateTokenSpy).not.toHaveBeenCalled()
  })
})

test('generateToken()', async () => {
  const user = buildUser()
  const jtwSignSpy = jest.spyOn(jwt, 'sign')

  await authService.generateToken(user)

  expect(jtwSignSpy).toHaveBeenNthCalledWith(1, expect.objectContaining({ id: user.id }), process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXP
  })
})
