'use strict'

const express = require('express')
const helmet = require('helmet')
const swaggerUi = require('swagger-ui-express')
const logger = require('morgan')
const cors = require('cors')
const path = require('path')
const yaml = require('js-yaml')
const fs = require('fs')

const router = require('./routes/router')

const swaggerDocument = yaml.load(fs.readFileSync(path.join(__dirname, '../docs/swagger.yml'), 'utf8'))

const app = express()

app.use(cors())
app.use(helmet())
app.use(logger('dev'))

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))
app.use('/', router)

module.exports = app
