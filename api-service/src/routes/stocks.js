'use strict'

const { Router } = require('express')
const { getStock, getHistory, getStats } = require('../controllers/stocks')
const { guard } = require('../middlewares/auth')

const router = Router({ mergeParams: true })

router.get('/stocks', getStock)
router.get('/history', getHistory)
router.get('/stats', guard('SUPERUSER'), getStats)

module.exports = router
