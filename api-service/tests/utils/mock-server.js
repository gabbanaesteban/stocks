'use strict'

const { rest } = require('msw')
const { setupServer } = require('msw/node')

const { buildStock } = require('./generate')

const server = setupServer(
  rest.get('http://stock-service/stocks', (req, res, ctx) => {
    return res(ctx.json(buildStock()))
  })
)

module.exports = server
