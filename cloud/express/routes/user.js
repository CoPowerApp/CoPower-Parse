var User = Parse.User

module.exports.auth = function(req, res, next) {
  if(req.session.user) {
		var user = new User()
    user.id = req.session.user

    user.fetch().then(function() {
      req.user = user
      next()
    })
	} else if(req.xhr) {
		res.errorT("Login required")
	} else {
		res.renderT("login")
	}
}

module.exports.login = function(req, res) {
  Parse.User.logIn(
    req.param("email"), req.param("password")
  ).then(function(user) {
    req.session.user = user.id
    res.successT()
  }, function() {
    res.errorT("Invalid Credentials")
  })
}

module.exports.register = function(req, res) {
  var user = new Parse.User()
  user.set("username", req.param("username"))
  user.set("email", req.param("email"))
  user.set("password", req.param("password"))
  
  user.signUp()
  
}