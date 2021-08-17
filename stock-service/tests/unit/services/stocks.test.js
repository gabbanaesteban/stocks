'use strict'

const { NotFound } = require('http-errors')
const stooqService = require('../../../src/services/stooq')
const stocksService = require('../../../src/services/stocks')

const server = require('../../utils/mock-server')

beforeAll(() => server.listen())

afterAll(() => server.close())

beforeEach(() => jest.clearAllMocks())

describe('getStock()', () => {
  test('should return a stock from stooq service based on symbol', async () => {
    const getStockBySymbolSpy = jest.spyOn(stooqService, 'getStockBySymbol')

    const result = await stocksService.getStock('AAPL')

    expect(getStockBySymbolSpy).toHaveBeenNthCalledWith(1, 'AAPL')
    expect(result).toEqual(await getStockBySymbolSpy.mock.results[0].value)
  })

  test('should throw a not found error when stock has N/D data', async () => {
    const getStockBySymbolSpy = jest.spyOn(stooqService, 'getStockBySymbol')

    await expect(stocksService.getStock('notfound')).rejects.toThrow(NotFound)

    expect(getStockBySymbolSpy).toHaveBeenNthCalledWith(1, 'notfound')
  })
})
