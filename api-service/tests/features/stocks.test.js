'use strict'

const request = require('supertest')
const app = require('../../src/app')
const prisma = require('../../src/db/client')

const { buildAuthParams, buildFormattedStock, buildHistory } = require('../utils/generate')
const server = require('../utils/mock-server')

beforeAll(() => server.listen({ onUnhandledRequest: 'bypass' }))

afterAll(async () => {
  await prisma.$disconnect()
  server.close()
})

describe('GET /stocks', () => {
  test('should return the requested stock by symbol', async () => {
    const { body } = await request(app).post('/register').send(buildAuthParams())

    const response = await request(app).get('/stocks').set('Authorization', `Bearer ${body.token}`).query({ q: 'AAPL' })

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual(buildFormattedStock())
  })

  test('should responds with 401 when missing token', async () => {
    const response = await request(app).get('/stocks').query({ q: 'AAPL' })

    expect(response.statusCode).toBe(401)
    expect(response.body).toHaveProperty('error', expect.stringMatching(/Invalid token/))
  })

  test('should responds with 400 when stock symbol', async () => {
    const { body } = await request(app).post('/register').send(buildAuthParams())

    const response = await request(app).get('/stocks').set('Authorization', `Bearer ${body.token}`)

    expect(response.statusCode).toBe(400)
    expect(response.body).toHaveProperty('error', expect.stringMatching(/q parameter is required/))
  })
})

describe('GET /history', () => {
  test('should response with the history for the user', async () => {
    const { body: user } = await request(app).post('/register').send(buildAuthParams())
    const { body: anotherUser } = await request(app).post('/register').send(buildAuthParams())

    await Promise.all([
      request(app).get('/stocks').set('Authorization', `Bearer ${user.token}`).query({ q: 'AAPL' }),
      request(app).get('/stocks').set('Authorization', `Bearer ${user.token}`).query({ q: 'AAPL' }),
      request(app).get('/stocks').set('Authorization', `Bearer ${anotherUser.token}`).query({ q: 'AAPL' })
    ])

    const response = await request(app).get('/history').set('Authorization', `Bearer ${user.token}`)

    expect(response.statusCode).toBe(200)
    expect(response.body).toHaveLength(2)

    for (const property in buildHistory()[0]) {
      expect(response.body[0]).toHaveProperty(property)
    }
  })

  test('should responds with 401 when missing token', async () => {
    const response = await request(app).get('/history')

    expect(response.statusCode).toBe(401)
    expect(response.body).toHaveProperty('error', expect.stringMatching(/Invalid token/))
  })
})

describe('GET /stats', () => {
  test('should response with the stats for super users', async () => {
    const { body: user } = await request(app).post('/register').send(buildAuthParams())
    const { body: superUser } = await request(app).post('/signin').send({
      email: 'superuser@jobsity.com',
      password: 'test'
    })

    await request(app).get('/stocks').set('Authorization', `Bearer ${user.token}`).query({ q: 'AAPL' })
    await request(app).get('/stocks').set('Authorization', `Bearer ${superUser.token}`).query({ q: 'TSLA' })

    const response = await request(app).get('/stats').set('Authorization', `Bearer ${superUser.token}`)

    expect(response.statusCode).toBe(200)
    expect(response.body).toHaveLength(2)
  })

  test('should response with 403 for users', async () => {
    const { body: user } = await request(app).post('/register').send(buildAuthParams())

    const response = await request(app).get('/stats').set('Authorization', `Bearer ${user.token}`)

    expect(response.statusCode).toBe(403)
    expect(response.body).toHaveProperty('error', expect.stringMatching(/not allowed/))
  })

  test('should responds with 401 when missing token', async () => {
    const response = await request(app).get('/stats')

    expect(response.statusCode).toBe(401)
    expect(response.body).toHaveProperty('error', expect.stringMatching(/Invalid token/))
  })
})
