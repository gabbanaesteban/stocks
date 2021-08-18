'use strict'

const { buildReq, buildRes, buildToken, buildAuthParams } = require('../../utils/generate')

const { authSchema } = require('../../../src/schemas/auth')
const helpers = require('../../../src/utils/helpers')
const authService = require('../../../src/services/auth')
const authController = require('../../../src/controllers/auth')

jest.mock('../../../src/services/auth')

describe('signUp()', () => {
  it('responds with token for the user', async () => {
    const req = buildReq(null, { body: buildAuthParams() })
    const res = buildRes()
    const expectedResponse = buildToken()

    const validateParamsSpy = jest.spyOn(helpers, 'validateParams')
    authService.signUp.mockResolvedValue(expectedResponse)

    await authController.signUp(req, res)

    expect(validateParamsSpy).toHaveBeenCalledWith(req.body, authSchema)

    expect(authService.signUp).toHaveBeenCalledWith(req.body.email, req.body.password)
    expect(res.json).toHaveBeenNthCalledWith(1, expectedResponse)
    expect(res.status).toHaveBeenNthCalledWith(1, 201)
  })
})

describe('signIn()', () => {
  it('responds with token for the user', async () => {
    const req = buildReq(null, { body: buildAuthParams() })
    const res = buildRes()
    const expectedResponse = buildToken()

    const validateParamsSpy = jest.spyOn(helpers, 'validateParams')
    authService.signIn.mockResolvedValue(expectedResponse)

    await authController.signIn(req, res)

    expect(validateParamsSpy).toHaveBeenCalledWith(req.body, authSchema)

    expect(authService.signIn).toHaveBeenCalledWith(req.body.email, req.body.password)
    expect(res.json).toHaveBeenNthCalledWith(1, expectedResponse)
  })
})
