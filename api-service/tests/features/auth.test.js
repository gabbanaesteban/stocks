'use strict'

const request = require('supertest')
const app = require('../../src/app')
const prisma = require('../../src/db/client')

const { buildAuthParams } = require('../utils/generate')

afterAll(async () => {
  await prisma.$disconnect()
})

describe('POST /register', () => {
  test('should create a user and return a token', async () => {
    const response = await request(app).post('/register').send(buildAuthParams())

    expect(response.statusCode).toBe(201)
    expect(response.body).toHaveProperty('token', expect.stringContaining('.'))
  })

  test('should responds with 400 when missing password', async () => {
    const response = await request(app)
      .post('/register')
      .send({ ...buildAuthParams(), password: undefined })

    expect(response.statusCode).toBe(400)
    expect(response.body).toHaveProperty('error', expect.stringMatching(/password/))
  })

  test('should responds with 400 when missing email', async () => {
    const response = await request(app)
      .post('/register')
      .send({ ...buildAuthParams(), email: undefined })

    expect(response.statusCode).toBe(400)
    expect(response.body).toHaveProperty('error', expect.stringMatching(/email/))
  })
})

describe('POST /signin', () => {
  test('should respond a token for successful sign in', async () => {
    const authParams = buildAuthParams()
    await request(app).post('/register').send(authParams)

    const response = await request(app).post('/signin').send(authParams)

    expect(response.statusCode).toBe(200)
    expect(response.body).toHaveProperty('token', expect.stringContaining('.'))
  })

  test('should respond with 404 for not found user', async () => {
    const response = await request(app).post('/signin').send(buildAuthParams())

    expect(response.statusCode).toBe(404)
    expect(response.body).toHaveProperty('error', expect.stringMatching(/not found/))
  })

  test('should respond with 401 for not inbvalid password', async () => {
    const authParams = buildAuthParams()
    await request(app).post('/register').send(authParams)

    const response = await request(app)
      .post('/signin')
      .send({ ...authParams, password: 'wrong' })

    expect(response.statusCode).toBe(401)
    expect(response.body).toHaveProperty('error', expect.stringMatching(/incorrect/))
  })

  test('should responds with 400 when missing password', async () => {
    const response = await request(app)
      .post('/signin')
      .send({ ...buildAuthParams(), password: undefined })

    expect(response.statusCode).toBe(400)
    expect(response.body).toHaveProperty('error', expect.stringMatching(/password/))
  })

  test('should responds with 400 when missing email', async () => {
    const response = await request(app)
      .post('/signin')
      .send({ ...buildAuthParams(), email: undefined })

    expect(response.statusCode).toBe(400)
    expect(response.body).toHaveProperty('error', expect.stringMatching(/email/))
  })
})
