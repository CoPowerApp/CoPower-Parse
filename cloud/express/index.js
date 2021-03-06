var express = require('express')
var app = express()
 
// Set Master Key
Parse.Cloud.useMasterKey()

// Routes
  var routes = {
    index: require("cloud/express/routes/index.js"),
    user: require("cloud/express/routes/user.js"),
    store: require("cloud/express/routes/store.js"),
    conflict: require("cloud/express/routes/conflict.js"),
    message: require("cloud/express/routes/message.js")
  }

// Global app configuration section
app.set('views', 'cloud/express/views')
app.set('view engine', 'ejs')
app.enable('trust proxy')
 
// Configure express routes
app.use(express.bodyParser())
app.use(express.cookieParser())
app.use(express.cookieSession({
  secret: 'ursid',
  cookie: {
      httpOnly: true
  }
}))

app.use(function(req, res, next) {
  res.successT = function(data) {
    data = data || {}
    data.success = true
    res.json(data)
  }

  res.errorT = function(error) {
    error = error.description || error

    res.json({
      success: false,
      status: 1,
      message: error
    })
  }

  res.renderT = function(template, data) {
    data = data || {}
    data.host = req.protocol + "://" + req.host
    data.url = data.host + req.url
    data.template = data.template || template
    data.user = data.user || req.session.user
    data.random = Math.random().toString(36).slice(2)
    res.render(template, data)
  }

  next()
})

// Landings
app.post('/login', routes.user.login)
app.get('/geoQuery', routes.store.geoQuery)
app.get('/similarConflicts', routes.conflict.getSimilar)
app.get('/getByType', routes.conflict.getByType)
app.get('/getMessages', routes.message.getMessages)
app.get('/getConflicts', routes.conflict.getConflicts)


// app.get('/', routes.index.landing)




// Not Found Redirect
// app.all("*", routes.index.notFound)
 
// Listen to Parse
app.listen()
