'use strict'

const asyncHandler = require('express-async-handler')

const { getStockSchema } = require('../schemas/stocks')
const helpers = require('../utils/helpers')
const stocksService = require('../services/stocks')

async function getStock(req, res) {
  const { q: symbol } = await helpers.validateParams(req.query, getStockSchema)
  const response = await stocksService.getStock(symbol, req.user)
  res.json(response)
}

async function getHistory(req, res) {
  const response = await stocksService.getHistory(req.user)
  res.json(response)
}

async function getStats(req, res) {
  const response = await stocksService.getStats()
  res.json(response)
}

const API = {
  getStock: asyncHandler(getStock),
  getHistory: asyncHandler(getHistory),
  getStats: asyncHandler(getStats)
}

module.exports = API
