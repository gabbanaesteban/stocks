'use strict'

const asyncHandler = require('express-async-handler')
const createError = require('http-errors')
const jwt = require('jsonwebtoken')
const prisma = require('../db/client')

async function protect(req, res, next) {
  const token = API._getTokenFromHeader(req.headers.authorization)

  if (!token) {
    throw new createError.Unauthorized('Invalid token')
  }

  let userId

  try {
    const payload = await API._verifyToken(token)
    userId = payload.id
  } catch {
    throw new createError.Unauthorized('Invalid token')
  }

  const user = await prisma.user.findFirst({ where: { id: userId } })

  if (!user) {
    throw new createError.NotFound('User not found')
  }

  req.user = user
  next()
}

function guard(role) {
  return asyncHandler(async (req, res, next) => {
    if (req?.user?.role === role) next()
    else throw new createError.Forbidden('You are not allowed to access this resource')
  })
}

function _getTokenFromHeader(header) {
  if (!header || !header.startsWith('Bearer ')) {
    return undefined
  }

  const [, token] = header.split('Bearer ', 2)

  return token
}

async function _verifyToken(token) {
  return new Promise((resolve, reject) => {
    jwt.verify(token, process.env.JWT_SECRET, (err, data) => {
      if (err) reject(err)
      else resolve(data)
    })
  })
}

const API = {
  protect: asyncHandler(protect),
  guard,
  _getTokenFromHeader,
  _verifyToken
}

module.exports = API
