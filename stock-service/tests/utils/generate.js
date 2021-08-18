'use strict'

const path = require('path')
const fs = require('fs')

function buildStock(overrides = {}) {
  return {
    symbol: 'AAPL.US',
    date: '2021-08-16',
    time: '22:00:06',
    open: '148.535',
    high: '151.19',
    low: '146.47',
    close: '151.12',
    volume: '103558782',
    name: 'APPLE',
    ...overrides
  }
}

function buildReq(overrides = {}) {
  const req = { body: {}, params: {}, query: {}, ...overrides }
  return req
}

function buildRes(overrides = {}) {
  const res = {
    json: jest.fn(() => res).mockName('json'),
    status: jest.fn(() => res).mockName('status'),
    ...overrides
  }
  return res
}

function buildNext(impl) {
  return jest.fn(impl).mockName('next')
}

function getStockBuffer() {
  return fs.readFileSync(path.resolve(__dirname, `../fixtures/stock.csv`))
}

function getNotFoundStockBuffer() {
  return fs.readFileSync(path.resolve(__dirname, `../fixtures/notFoundStock.csv`))
}

const API = {
  buildStock,
  buildReq,
  buildRes,
  buildNext,
  getStockBuffer,
  getNotFoundStockBuffer
}

module.exports = API
