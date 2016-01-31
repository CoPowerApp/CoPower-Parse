var Store = Parse.Object.extend("Store")

module.exports.getStores = function(req, res) {
  var stores = []
  var query = new Parse.Query(Store)

  query.find().then(function(result) {
    if (result.length < 1) console.log("Query failed")
    result.forEach(function(store) {

      console.log(store.toString)

      var data = {
        id: store.id,
        address: store.get("address"),
        city: store.get("city")
      }

      stores.push(data)

    })
  }).then(function() {
    res.successT({
      stores: stores
    })
  })

}

module.exports.geoQuery = function(req, res) {
  var userLocation = new Parse.GeoPoint({latitude:37.0005932, longitude:-122.0577319})
  
  var storesFound = []
  
  var geoQuery = new Parse.Query(Store)
    
//   geoQuery.withinMiles("location", userLocation, 3)
  geoQuery.near("location", userLocation)
  geoQuery.limit(20)
  
  geoQuery.find().then(function(stores){
    for(i=0; i<stores.length; i++) {
      var storeLocation = new Parse.GeoPoint()
      storeLocation = stores[i].get("location")
   
      var data = {
        lat: storeLocation.latitude,
        long: storeLocation.longitude,
        id: stores[i].get("objectId"),
        address: stores[i].get("address"),
        city: stores[i].get("city"),
        county: stores[i].get("county")
      }
      
      
      storesFound.push(data)
    }
    
  }).then(function() {
    res.successT({
      storesFound: storesFound
    })
  })
  
}


module.exports.getConflictCount = function(req, res) {
  var storeId = req.param("storeId")
  var store = new Store()
  store.id = storeId
  
  
  var conflictQuery = new Parse.Query(Conflict)
  conflictQuery.equalTo("store", store)
  
  conflictQuery.find().then(function(conflicts) {
    console.log("Conflicts: "+conflicts.length)
  })
  
}



module.exports.getConflictCountByType = function(req, res) {
  var Conflict = Parse.Object.extend("Conflict")
  
  var storeId = req.param("storeId")
  var type = 1
  var store = new Store()
  var stores = []
  store.id = storeId
  
  var storeQuery = new Parse.Query(Store)
  storeQuery.each(function(store) {
     var conflictQuery = new Parse.Query(Conflict)
    conflictQuery.equalTo("store", store)
    conflictQuery.equalTo("type", type)

    conflictQuery.find().then(function(conflicts) {
      // store conflict amount
      var data = {
        store: store.toString,
        conflictCount: conflicts.length
      }
      
      stores.push(data)
      console.log("Conflicts: "+conflicts.length)
    })
  }).then(function() {
    console.log("STORES AND CONFLICTS BY TYPE:  "+stores)
  })
 
  
}

