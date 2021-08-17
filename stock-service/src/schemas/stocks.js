'use strict'

const yup = require('yup')

const getStockSchema = yup.object().shape({
  q: yup.string().trim().lowercase().required('q parameter is required')
})

const API = { getStockSchema }

module.exports = API
