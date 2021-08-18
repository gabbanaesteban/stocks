'use strict'

const { NotFound } = require('http-errors')
const stooq = require('./stooq')

/**
 * @param {string} symbol
 * @returns {Promise<Object>}
 */
async function getStock(symbol) {
  const stock = await stooq.getStockBySymbol(symbol)

  if (stock.date === 'N/D') {
    throw new NotFound(`Stock with symbol: ${symbol} not found`)
  }

  return stock
}

const API = {
  getStock
}

module.exports = API
