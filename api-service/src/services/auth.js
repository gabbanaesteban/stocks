'use strict'

const createError = require('http-errors')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const { PrismaClient } = require('@prisma/client')

const JWT_SECRET = process.env.JWT_SECRET
const JWT_EXP = process.env.JWT_EXP

async function signUp(email, password) {
  const prisma = new PrismaClient()

  const passwordHash = await API._hashPassword(password)

  const user = await prisma.user.create({
    data: {
      email,
      password: passwordHash
    }
  })

  const token = API._generateToken(user)

  return { token }
}

async function signIn(email, password) {
  const prisma = new PrismaClient()

  const user = await prisma.user.findFirst({ where: { email } })

  if (!user) {
    throw new createError.NotFound('User not found')
  }

  const match = await API._checkPassword(password, user.password)

  if (!match) {
    throw new createError.Unauthorized('Password incorrect')
  }

  const token = API._generateToken(user)

  return { token }
}

function _generateToken(user) {
  return jwt.sign({ id: user.id }, JWT_SECRET, {
    expiresIn: JWT_EXP
  })
}

function _hashPassword(password) {
  return new Promise((resolve, reject) => {
    bcrypt.hash(password, 8, (err, hash) => {
      if (err) reject(err)
      else resolve(hash)
    })
  })
}

function _checkPassword(password, passwordHash) {
  return new Promise((resolve, reject) => {
    bcrypt.compare(password, passwordHash, (err, match) => {
      if (err) reject(err)
      else resolve(match)
    })
  })
}

const API = {
  signUp,
  signIn,
  _generateToken,
  _checkPassword,
  _hashPassword
}

module.exports = API
