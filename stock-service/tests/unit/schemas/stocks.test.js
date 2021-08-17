'use strict'

const { getStockSchema } = require('../../../src/schemas/stocks')

describe('getStockSchema', () => {
  test('q is required', async () => {
    await expect(getStockSchema.validate({})).rejects.toThrow(/is required/)
  })

  test('q should be formatted to lowercase', async () => {
    const result = await getStockSchema.validate({ q: 'AAPL' })
    expect(result).toHaveProperty('q', 'aapl')
  })

  test('q should be trimmed', async () => {
    const result = await getStockSchema.validate({ q: '  aapl ' })
    expect(result).toHaveProperty('q', 'aapl')
  })
})
