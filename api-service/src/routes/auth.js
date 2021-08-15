'use strict'

const { Router } = require('express')
const { signUp, signIn } = require('../controllers/auth')

const router = Router({ mergeParams: true })

router.post('/register', signUp)
router.post('/signin', signIn)

module.exports = router
