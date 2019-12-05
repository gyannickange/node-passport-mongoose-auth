const createError = require('http-errors')
const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const logger = require('morgan')
const compression = require('compression')
const connectMongo = require('connect-mongo')
const flash = require('connect-flash')
const methodOverride = require('method-override')
const mongoose = require('mongoose')
const session = require('express-session')
const passport = require('passport')
const nunjucks = require('nunjucks')
const expressNunjucks = require('express-nunjucks')
const MongoStore = connectMongo(session)

const app = express()
const isDev = app.get('env') === 'development'

if (isDev) {
  require('dotenv').config()
}

const mail = require('./services/mail')
const filters = require('./filters')
const config = require('./config')

const authRouter = require('./routes/auth')
const adminRouter = require('./routes/admins')
const projectRouter = require('./routes/projects')

const njk = expressNunjucks(app, {
  watch: isDev,
  noCache: isDev
});

const env = nunjucks.configure(app.get('views'), {
  autoescape: true,
  express: app
});

// Mongoose connection
mongoose
  .connect(config.mongodb || 'mongodb://localhost/node-start', {
    useUnifiedTopology: true,
    useCreateIndex: true,
    useNewUrlParser: true,
  })
  .then(() => console.log('Connected to MongoDB...'))
  .catch(err => console.error('Could not connect to MongoDB...'))

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'html')


mail.init();

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))
app.use(session({
  store: new MongoStore({
    url: config.mongodb || 'mongodb://localhost/node-start'
  }),
  secret: config.session.secret,
  saveUninitialized: true,
  resave: true
}))

app.use(passport.initialize())
app.use(passport.session())
app.use(flash())

app.use(compression())
app.use(bodyParser.urlencoded({ extended: true }))

app.use(methodOverride('_method'))

app.use((req, res, next) => {
  res.locals.user = req.user
  res.locals.appUrl = config.appUrl
  res.sendMail = mail.sendMail
  res.locals.login = req.isAuthenticated()
  next()
});

filters(env)

app.use('/', authRouter)
app.use('/admins', adminRouter)
app.use('/projects', projectRouter)

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404))
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
});

module.exports = app
