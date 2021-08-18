'use strict'

const { NotFound, Unauthorized } = require('http-errors')
const jwt = require('jsonwebtoken')
const prismaMock = require('../../utils/mock-db')
const stocksService = require('../../../src/services/stocks')
const { buildUser, buildStock, buildFormattedStock, buildHistory } = require('../../utils/generate')
const server = require('../../utils/mock-server')

beforeAll(() => server.listen())
afterAll(() => server.close())

beforeEach(() => jest.clearAllMocks())

test('getStock()', async () => {
  const symbol = 'aapl.us'
  const user = buildUser()
  const stock = buildStock()
  const formattedStock = buildFormattedStock()

  const getStockInfoSpy = jest.spyOn(stocksService, '_getStockInfo')
  const saveStockRequestSpy = jest.spyOn(stocksService, '_saveStockRequest')
  prismaMock.stock.create.mockResolvedValue()

  const result = await stocksService.getStock(symbol, user)

  expect(getStockInfoSpy).toHaveBeenCalledWith(symbol)
  expect(saveStockRequestSpy).toHaveBeenCalledWith(symbol, stock, user)

  expect(result).toEqual(formattedStock)
})

test('getHistory()', async () => {
  const user = buildUser()

  prismaMock.stock.findMany.mockResolvedValue([{ content: buildStock(), createdAt: 'date' }])

  const result = await stocksService.getHistory(user)

  expect(prismaMock.stock.findMany).toHaveBeenCalledWith({ where: { authorId: user.id } })

  expect(result).toEqual([{ ...buildFormattedStock(), date: 'date' }])
})

test('getStats()', async () => {
  const symbol = 'aapl.us'
  const requestCount = 10

  prismaMock.stock.groupBy.mockResolvedValue([{ symbol, _count: { _all: requestCount } }])

  const result = await stocksService.getStats()

  expect(prismaMock.stock.groupBy).toHaveBeenCalled()

  expect(result).toEqual([{ stock: symbol, times_requested: requestCount }])
})

test('_saveStockRequest()', async () => {
  const symbol = 'aapl.us'
  const stock = buildStock()
  const user = buildUser()

  prismaMock.stock.create.mockResolvedValue()

  await stocksService._saveStockRequest(symbol, stock, user)

  expect(prismaMock.stock.create).toHaveBeenCalledWith({
    data: {
      symbol,
      content: stock,
      authorId: user.id
    }
  })
})

test('_getStockInfo()', async () => {
  const result = await stocksService._getStockInfo('aaple.us')
  expect(result).toEqual(buildStock())
})

test('formatStock()', () => {
  const result = stocksService.formatStock(buildStock())
  expect(result).toEqual(buildFormattedStock())
})
