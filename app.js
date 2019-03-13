const createError = require('http-errors')
const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const csv = require('csv-parser')
const axios = require('axios')

const app = express()

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.use(cors())
app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())

// requête get sur http://localhost/products
router.get('/products', async (req, res, next) => {
  const searchTerms = req.query['search_terms']

  const result = await axios({
    method: 'get',
    url: `https://fr.openfoodfacts.org/cgi/search.pl?action=process&search_terms=${searchTerms}&sort_by=unique_scans_n&page_size=20&download=on`,
    responseType: 'stream'
  })

  const results = []

  result.data.pipe(csv({ separator: '\t' }))
    .on('data', (data) => results.push(data))
    .on('end', () => {
      // console.log(results)
      res.json(results)
    })
})

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404))
})

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

module.exports = app
