'use strict'

const { Router } = require('express')
const { getStock } = require('../controllers/stocks')

const routes = Router({ mergeParams: true })

routes.get('/', getStock)

module.exports = routes
