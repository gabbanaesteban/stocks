'use strict'

const jwt = require('jsonwebtoken')
const { NotFound, Unauthorized, Forbidden } = require('http-errors')
const { buildReq, buildNext, buildUser, buildSuperuser } = require('../../utils/generate')
const prismaMock = require('../../utils/mock-db')
const authMiddleware = require('../../../src/middlewares/auth')

afterEach(() => jest.restoreAllMocks())

describe('protect()', () => {
  test('should respond 401 when no token is found in the request', async () => {
    const next = buildNext()

    await authMiddleware.protect(buildReq(), null, next)

    expect(next.mock.calls[0][0]).toBeInstanceOf(Unauthorized)
    expect(next).toHaveBeenCalledTimes(1)
  })

  test('should respond 401 when token is invalid', async () => {
    const token = 'Bearer token'
    const next = buildNext()
    const req = buildReq(null, { headers: { authorization: token } })

    const verifyTokenSpy = jest.spyOn(authMiddleware, '_verifyToken')

    await authMiddleware.protect(req, null, next)

    expect(verifyTokenSpy).toHaveBeenNthCalledWith(1, 'token')
    expect(next.mock.calls[0][0]).toBeInstanceOf(Unauthorized)
    expect(next).toHaveBeenCalledTimes(1)
  })

  test('should respond 404 if the user in the token is not found', async () => {
    const token = 'Bearer token'
    const next = buildNext()
    const req = buildReq(null, { headers: { authorization: token } })
    const userId = 1

    jest.spyOn(authMiddleware, '_verifyToken').mockImplementation(() => ({ id: userId }))
    prismaMock.user.findFirst.mockImplementation(() => undefined)

    await authMiddleware.protect(req, null, next)

    expect(next.mock.calls[0][0]).toBeInstanceOf(NotFound)
    expect(next).toHaveBeenCalledTimes(1)
  })

  test('should add the user to request', async () => {
    const user = buildUser()
    const token = 'Bearer token'
    const next = buildNext()
    const req = buildReq(null, { headers: { authorization: token } })

    jest.spyOn(authMiddleware, '_verifyToken').mockImplementation(() => ({ id: user.id }))
    prismaMock.user.findFirst.mockImplementation(() => user)

    await authMiddleware.protect(req, null, next)

    expect(req.user).toBe(user)
    expect(next).toHaveBeenCalledTimes(1)
  })
})

test('_getTokenFromHeader()', () => {
  expect(authMiddleware._getTokenFromHeader()).toBe(undefined)
  expect(authMiddleware._getTokenFromHeader('token')).toBe(undefined)
  expect(authMiddleware._getTokenFromHeader('Bearer token')).not.toBe(undefined)
})

describe('guard()', () => {
  test('should respond 403 when the provided user does not have the right role', async () => {
    const next = buildNext()
    const req = buildReq()

    await authMiddleware.guard('SUPERUSER')(req, null, next)

    expect(next.mock.calls[0][0]).toBeInstanceOf(Forbidden)
    expect(next).toHaveBeenCalledTimes(1)
  })

  test('should call next when the provided user have the right role', async () => {
    const next = buildNext()
    const req = buildReq(buildSuperuser())

    await authMiddleware.guard('SUPERUSER')(req, null, next)

    expect(next.mock.calls[0][0]).toBeInstanceOf(Forbidden)
    expect(next).toHaveBeenCalledTimes(1)
  })
})
