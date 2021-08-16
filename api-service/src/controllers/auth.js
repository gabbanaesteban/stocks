'use strict'

const asyncHandler = require('express-async-handler')

const { authSchema } = require('../schemas/auth')
const { validateParams } = require('../utils/helpers')
const authService = require('../services/auth')

async function signUp(req, res) {
  const params = req.body
  const { email, password } = await validateParams(params, authSchema)
  const response = await authService.signUp(email, password)
  res.status(201).json(response)
}

async function signIn(req, res) {
  const params = req.body
  const { email, password } = await validateParams(params, authSchema)
  const response = await authService.signIn(email, password)
  res.json(response)
}

const API = {
  signUp: asyncHandler(signUp),
  signIn: asyncHandler(signIn)
}

module.exports = API
