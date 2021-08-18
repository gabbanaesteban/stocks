'use strict'

const request = require('supertest')

const app = require('../../src/app')
const { buildStock } = require('../utils/generate')
const server = require('../utils/mock-server')

beforeAll(() => server.listen({ onUnhandledRequest: 'bypass' }))
afterAll(() => server.close())

describe('GET /stocks', () => {
  test('responds with 400 for request missing q query string', async () => {
    const response = await request(app).get('/stocks')
    expect(response.statusCode).toBe(400)
    expect(response.body).toHaveProperty('error', 'q parameter is required')
  })

  test('responds with 404 when no stock is found', async () => {
    const response = await request(app).get('/stocks?q=notfound')
    expect(response.statusCode).toBe(404)
    expect(response.body).toHaveProperty('error', expect.stringMatching(/not found/))
  })

  test('responds with requested stock', async () => {
    const response = await request(app).get('/stocks?q=aaple.us')
    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual(buildStock())
  })
})
