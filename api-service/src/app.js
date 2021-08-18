'use strict'

const express = require('express')
const helmet = require('helmet')
const swaggerUi = require('swagger-ui-express')
const logger = require('morgan')
const cors = require('cors')
const path = require('path')
const yaml = require('js-yaml')
const fs = require('fs')

require('dotenv').config()

const router = require('./routes/router')

const swaggerDocument = yaml.load(fs.readFileSync(path.join(__dirname, '../docs/swagger.yml'), 'utf8'))
const swaggerOptions = {
  swaggerOptions: {
    requestInterceptor: (req) => {
      if (req.headers['Authorization'] && !req.headers['Authorization'].startsWith('Bearer ')) {
        req.headers['Authorization'] = `Bearer ${req.headers['Authorization']}`
      }
      return req
    }
  }
}

const app = express()

app.use(express.json())
app.use(cors())
app.use(helmet())
app.use(logger('dev'))

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, swaggerOptions))

app.use('/', router)

module.exports = app
