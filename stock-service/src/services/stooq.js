'use strict'

const util = require('util')
const axios = require('axios')
const parse = require('csv-parse')

const API_URL = 'https://stooq.com/q/l/?s=%s&f=sd2t2ohlcvn&h&e=csv'

/**
 * @param {string} symbol
 * @returns {Promise<Array<Object>>
 */
async function getStockBySymbol(symbol) {
  const { data } = await axios.get(util.format(API_URL, symbol), { responseType: 'blob' })

  const parserOptions = {
    columns: (header) => header.map((column) => column.toLowerCase())
  }

  return new Promise((resolve, reject) => {
    parse(data, parserOptions, (err, data) => {
      if (err) reject(err)
      else resolve(data)
    })
  })
}

const API = {
  getStockBySymbol
}

module.exports = API
