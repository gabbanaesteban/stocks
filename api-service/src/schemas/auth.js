'use strict'

const yup = require('yup')

const email = yup.string().email().trim().lowercase()

const authSchema = yup.object().shape({
  email: email.required(),
  password: yup.string().required()
})

const API = {
  authSchema
}

module.exports = API
