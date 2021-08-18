'use strict'

const { NotFound } = require('http-errors')

function notFound(req, res, next) {
  const error = new NotFound(`Not Found - ${req.originalUrl}`)
  next(error)
}

function errorHandler(error, req, res, next) {
  error?.statusCode ? res.status(error.statusCode) : res.status(500)

  res.json({
    error: error.message,
    stack: process.env.NODE_ENV === 'production' ? null : error.stack
  })
}

const API = { notFound, errorHandler }

module.exports = API
