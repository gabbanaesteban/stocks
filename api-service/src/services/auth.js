'use strict'

const createError = require('http-errors')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const prisma = require('../db/client')

async function signUp(email, password) {
  const passwordHash = await API.hashPassword(password)

  const user = await prisma.user.create({
    data: {
      email,
      password: passwordHash
    }
  })

  const token = API.generateToken(user)

  return { token }
}

async function signIn(email, password) {
  const user = await prisma.user.findFirst({ where: { email } })

  if (!user) {
    throw new createError.NotFound('User not found')
  }

  const match = await API.checkPassword(password, user.password)

  if (!match) {
    throw new createError.Unauthorized('Password incorrect')
  }

  const token = API.generateToken(user)

  return { token }
}

function generateToken(user) {
  return jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXP
  })
}

function hashPassword(password) {
  return new Promise((resolve, reject) => {
    bcrypt.hash(password, 8, (err, hash) => {
      if (err) reject(err)
      else resolve(hash)
    })
  })
}

function checkPassword(password, passwordHash) {
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
  generateToken,
  checkPassword,
  hashPassword
}

module.exports = API
