'use strict'

const { Router } = require('express')
const stocksRoutes = require('./stocks')
const { notFound, errorHandler } = require('../middlewares/error')

const router = Router()

router.use('/stocks', stocksRoutes)

router.use(errorHandler)
router.use(notFound)

module.exports = router
