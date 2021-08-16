'use strict'

const { PrismaClient } = require('@prisma/client')
const users = require('./users')

const prisma = new PrismaClient()

async function main() {
  await prisma.user.createMany({ data: users })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
