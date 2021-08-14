'use strict'

const asyncHandler = require('express-async-handler')

const { getStockSchema } = require('../schemas/stocks')
const helpers = require('../utils/helpers')
const stocksService = require('../services/stocks')

async function getStock(req, res) {
  const { q: symbol } = await helpers.validateParams(req.query, getStockSchema)

  const response = await stocksService.getStock(symbol)
  res.json(response)
}

const API = {
  getStock: asyncHandler(getStock)
}

module.exports = API
