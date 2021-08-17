'use strict'

const faker = require('faker')

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

function buildFormattedStock(overrides = {}) {
  const { volume, date, time, ...stock } = buildStock()

  return {
    ...stock,
    ...overrides
  }
}

function buildHistory(overrides = {}) {
  return [
    {
      ...buildFormattedStock(),
      date: '2021-04-01T19:20:30Z',
      ...overrides
    }
  ]
}

function buildStats(overrides = {}) {
  return [
    {
      stock: 'aapl.us',
      times_requested: 5,
      ...overrides
    }
  ]
}

function buildReq(user = buildUser(), overrides = {}) {
  const req = {
    user,
    body: {},
    params: {},
    query: {},
    headers: {},
    ...overrides
  }
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

function buildUser(overrides = {}) {
  return {
    id: Date.now(),
    email: faker.internet.email(),
    role: 'user',
    ...overrides
  }
}

function buildSuperuser(overrides = {}) {
  return buildUser({ ...overrides, role: 'superuser' })
}

function buildAuthParams(overrides = {}) {
  return {
    email: faker.internet.email().toLowerCase(),
    password: faker.internet.password(),
    ...overrides
  }
}

function buildToken(overrides = {}) {
  return {
    token: faker.datatype.uuid(),
    ...overrides
  }
}

const API = {
  buildStock,
  buildFormattedStock,
  buildHistory,
  buildStats,
  buildReq,
  buildRes,
  buildNext,
  buildUser,
  buildSuperuser,
  buildAuthParams,
  buildToken
}

module.exports = API
