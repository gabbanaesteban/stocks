'use strict'

const util = require('util')
const axios = require('axios')
const { PrismaClient } = require('@prisma/client')

const { STOCKS_SERVICE_URL } = process.env
const GET_STOCK_URL = `${STOCKS_SERVICE_URL}/stocks?q=%s`

/**
 * @param {string} symbol
 * @param {Object} user
 * @returns {Promise<Object>}
 */
async function getStock(symbol, user) {
  const stock = await API._getStockInfo(symbol)

  await API._saveStockRequest(symbol, stock, user)

  return API.formatStock(stock)
}

/**
 * @param {Object} user
 * @returns {Promise<Array<Object>>}
 */
async function getHistory(user) {
  const { id: userId } = user

  const prisma = new PrismaClient()

  const history = await prisma.stock.findMany({ where: { authorId: userId } })

  return history.map(({ content, createdAt: date }) => {
    return {
      ...API.formatStock(content),
      date
    }
  })
}

/**
 * @returns {Promise<Array<Object>>}
 */
async function getStats() {
  const prisma = new PrismaClient()

  const stats = await prisma.stock.groupBy({
    by: ['symbol'],
    _count: { _all: true }
  })

  return stats.map((stock) => {
    return {
      stock: stock.symbol,
      times_requested: stock._count._all
    }
  })
}

/**
 * @param {string} symbol
 * @returns {Promise<Object>}
 */
async function _getStockInfo(symbol) {
  const url = util.format(GET_STOCK_URL, symbol)

  const { data: stock } = await axios.get(url)

  return stock
}

/**
 * @param {string} symbol
 * @param {Object} stock
 * @param {Object} user
 **/
async function _saveStockRequest(symbol, stock, user) {
  //TODO: use queue to save stock request
  const prisma = new PrismaClient()

  await prisma.stock.create({
    data: {
      symbol: symbol,
      content: stock,
      authorId: user.id
    }
  })
}

function formatStock(stock) {
  const { volume, date, time, ...formatted } = stock
  return formatted
}

const API = {
  getStock,
  getHistory,
  getStats,
  formatStock,
  _getStockInfo,
  _saveStockRequest
}

module.exports = API
