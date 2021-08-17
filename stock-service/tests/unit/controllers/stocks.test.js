'use strict'

const { buildStock, buildReq, buildRes } = require('../../utils/generate')

const { getStockSchema } = require('../../../src/schemas/stocks')
const helpers = require('../../../src/utils/helpers')
const stocksService = require('../../../src/services/stocks')
const stocksController = require('../../../src/controllers/stocks')

jest.mock('../../../src/services/stocks')

describe('getStock()', () => {
    it('responds with stock based on symbol', async () => {
        const symbol = 'aapl'
        const req = buildReq({  query: { q: symbol } })
        const res = buildRes()

        const validateParamsSpy = jest.spyOn(helpers, 'validateParams')
        stocksService.getStock.mockResolvedValue(buildStock())

        await stocksController.getStock(req, res)

        expect(validateParamsSpy).toHaveBeenCalledWith(req.query, getStockSchema)

        expect(stocksService.getStock).toHaveBeenCalledWith(symbol)
        expect(res.json).toHaveBeenNthCalledWith(1, buildStock())
    })
})

