'use strict'

const httpErrors = require('http-errors')

async function validateParams(params, schema, validationOptions = {}) {
  const options = {
    abortEarly: true,
    stripUnknown: true,
    ...validationOptions
  }

  try {
    const validatedParams = await schema.validate(params, options)
    return validatedParams
  } catch (validationError) {
    const [errorMessage] = validationError.errors
    throw new httpErrors.BadRequest(errorMessage)
  }
}

const API = {
  validateParams
}

module.exports = API
