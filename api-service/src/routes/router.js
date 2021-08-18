'use strict'

const { Router } = require('express')
const authRoutes = require('./auth')
const stocksRoutes = require('./stocks')
const { protect } = require('../middlewares/auth')
const { notFound, errorHandler } = require('../middlewares/error')

const router = Router()

router.use(authRoutes)

router.use(protect)
router.use(stocksRoutes)

router.use(errorHandler)
router.use(notFound)

module.exports = router
