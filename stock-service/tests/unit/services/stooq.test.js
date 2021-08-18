'use strict'

const { buildStock } = require('../../utils/generate')
const stooqService = require('../../../src/services/stooq')

const server = require('../../utils/mock-server')

beforeAll(() => server.listen())

afterAll(() => server.close())

describe('getStockBySymbol()', () => {
  test('should return the requested stock as object', async () => {
    const stock = await stooqService.getStockBySymbol('AAPL')
    expect(stock).toMatchObject(buildStock())
  })
})
