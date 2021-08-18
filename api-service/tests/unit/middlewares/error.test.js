'use strict'

const { NotFound, Forbidden } = require('http-errors')
const { notFound, errorHandler } = require('../../../src/middlewares/error')
const { buildReq, buildNext, buildRes } = require('../../utils/generate')

describe('notFound()', () => {
  test('call next function with a NotFound error', () => {
    const next = buildNext()

    notFound(buildReq(), null, next)

    expect(next.mock.calls[0][0]).toBeInstanceOf(NotFound)
    expect(next).toHaveBeenCalledTimes(1)
  })
})

describe('errorHandler()', () => {
  test('responds with error status code', () => {
    const res = buildRes()
    const next = buildNext()
    const error = new Forbidden('Your are not allowed')

    errorHandler(error, null, res, next)

    expect(res.json).toHaveBeenCalledTimes(1)
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        error: error.message
      })
    )
    expect(next).not.toHaveBeenCalled()
  })

  test('responds with 500 for errors without status code', () => {
    const res = buildRes()
    const next = buildNext()

    notFound(buildReq(), null, next)

    expect(next.mock.calls[0][0]).toBeInstanceOf(NotFound)
    expect(next).toHaveBeenCalledTimes(1)
  })
})
