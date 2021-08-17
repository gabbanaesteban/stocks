'use strict'

const { mockDeep, mockReset } = require('jest-mock-extended')

const prisma = require('../../src/db/client')

jest.mock('../../src/db/client', () => mockDeep())

beforeEach(() => mockReset(prisma))

module.exports = prisma
