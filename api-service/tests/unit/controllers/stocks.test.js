'use strict'

const { buildStock, buildReq, buildRes, buildHistory, buildStats } = require('../../utils/generate')

const { getStockSchema } = require('../../../src/schemas/stocks')
const helpers = require('../../../src/utils/helpers')
const stocksService = require('../../../src/services/stocks')
const stocksController = require('../../../src/controllers/stocks')

jest.mock('../../../src/services/stocks')

describe('getStock()', () => {
  it('responds with stock based on symbol', async () => {
    const symbol = 'aapl'
    const req = buildReq(undefined, { query: { q: symbol } })
    const res = buildRes()

    const validateParamsSpy = jest.spyOn(helpers, 'validateParams')
    stocksService.getStock.mockResolvedValue(buildStock())

    await stocksController.getStock(req, res)

    expect(validateParamsSpy).toHaveBeenCalledWith(req.query, getStockSchema)

    expect(stocksService.getStock).toHaveBeenCalledWith(symbol, req.user)
    expect(res.json).toHaveBeenNthCalledWith(1, buildStock())
  })
})

describe('getHistory()', () => {
  it('responds with user stocks history', async () => {
    const req = buildReq()
    const res = buildRes()

    stocksService.getHistory.mockResolvedValue(buildHistory())

    await stocksController.getHistory(req, res)

    expect(stocksService.getHistory).toHaveBeenCalledWith(req.user)
    expect(res.json).toHaveBeenNthCalledWith(1, buildHistory())
  })
})

describe('getStats()', () => {
  it('responds stocks stats', async () => {
    const res = buildRes()

    stocksService.getStats.mockResolvedValue(buildStats())

    await stocksController.getStats(null, res)

    expect(stocksService.getStats).toHaveBeenCalledWith()
    expect(res.json).toHaveBeenNthCalledWith(1, buildStats())
  })
})
