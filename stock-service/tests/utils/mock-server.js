'use strict'

const { rest } = require('msw')
const { setupServer } = require('msw/node')

const { getStockBuffer, getNotFoundStockBuffer } = require('./generate')

const server = setupServer(
  rest.get('https://stooq.com/q/l', (req, res, ctx) => {
    const csvBuffer = req.url.searchParams.get('s') !== 'notfound' ? getStockBuffer() : getNotFoundStockBuffer()

    return res(ctx.set('Content-Type', 'text/csv; charset=utf-8'), ctx.body(csvBuffer))
  })
)

module.exports = server
