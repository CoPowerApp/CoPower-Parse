// Conflicts stuff
var Store = new Parse.Object.extend("Store")
var Conflict = new Parse.Object.extend("Conflict")
var User = new Parse.Object.extend("User")

module.exports.getConflicts = function(req, res) {
  var userId = req.param("user")
  var user = new User()
  var conflicts = []
  user.id = userId
  user.fetch().then(function() {
    var query = new Parse.Query(Conflict)
    query.equalTo("user", user)
    return query.find()
  }).then(function(results) {
    for(var i = 0; i < results.length; i++) {
      var data = {
        id : results[i].id,
        description : results[i].get("description")
      }
      
      conflicts.push(data)
    }
    
    res.successT({
      conflicts: conflicts
    })
    
  })
}

module.export.newConflict = function(req, res) {
  var Conflict = Parse.Object.extend("Conflict")
  var conflict = new Conflict()
  var type = 0
  var description = ""
  conflict.set("type", type)
  conflict.set("description", description)
  conflict.save().then(function() {
      console.log("Conflict successfully created")
  })
}

module.exports.getSimilar = function(req, res) {
  var userConflict = new Conflict()
  var similarConflicts = []
  userConflict.id = "QGafUruD3N"
  
  userConflict.fetch().then(function(){
    var userStore = new Store()
    userStore = userConflict.get("store")
    return userStore.fetch()
    
  }).then(function(userStore){
    var storeQuery = new Parse.Query(Store)
//     storeQuery.withinMiles("location", userStore.get("location"), 3)
    storeQuery.near("location", userStore.get("location"))
    storeQuery.limit(5)
        
    var conflictQuery = new Parse.Query(Conflict)
    conflictQuery.matchesQuery("store", storeQuery)
    conflictQuery.equalTo("type", userConflict.get("type"))
    conflictQuery.notEqualTo("objectId", userConflict.id)
    
    return conflictQuery.each(function(conflict) {
      var data = {
        description: conflict.get("description"),
        user: conflict.get("user"),
        store: conflict.get("store")
      }
      
      similarConflicts.push(data)
      
    })
  }).then(function() {
    res.successT({
      similarConflicts: similarConflicts
    })
  }, function(error) {
    res.errorT({
      description: error.message
    })
  })
  
}

module.exports.getByType = function(req, res) {
  var userLocation = new Parse.GeoPoint({latitude:37.0005932, longitude:-122.0577319})
  var type = parseInt(req.param("type"))
  console.log("TYPE REQUESTED:  "+type)
  var similarConflicts = []
  var conflictCount = 0
  
  var storeQuery = new Parse.Query(Store)
  storeQuery.withinMiles("location", userLocation, 90)
//   storeQuery.near("location", userLocation)
  
  var conflictQuery = new Parse.Query(Conflict)
  conflictQuery.matchesQuery("store", storeQuery)
  // conflictQuery.notEqualTo("user", Parse.User.getCurrentUser())
  conflictQuery.equalTo("type", type)  
  conflictQuery.each( function(conflict) {
    console.log("CONFLICT FOUND:  "+conflict.id)
    
    var data = {
      description: conflict.get("description"),
      store: conflict.get("store").id,
      type: conflict.get("type")
    }
    
    similarConflicts.push(data)
    conflictCount++
    
  }).then(function() {
    res.successT({
      similarConflicts: similarConflicts,
      conflictCount: conflictCount
    })
  }, function(error) {
    res.errorT({
      description: error.message
    })
  })
}


module.exports.displayConflictType = function(req, res) {
  var store = new Store()
  var query = new Parse.Query("Store")
  
  
  
  
}

