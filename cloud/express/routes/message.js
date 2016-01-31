// Message stuff
var User = Parse.Object.extend("User")
var Message = Parse.Object.extend("Message")
var Conversation = Parse.Object.extend("Conversation")

module.exports.getMessages = function(req, res) {
  var userId = req.param("user")
  var user = new User()
  var messages = []
  
  user.id = userId
  
  user.fetch().then(function(){
    
    var sentQuery = new Parse.Query(Message)
    sentQuery.equalTo("sender", user)
    
    var receivedQuery = new Parse.Query(Message)
    receivedQuery.equalTo("recipient", user)

    var query = new Parse.Query.or(sentQuery, receivedQuery)
  //   query.limit(100)
    query.addAscending("createdAt")
    return query.find()
  }).then(function(results) {
    for(var i = 0; i < results.length; i++) {
      
      var data = {
        sender: results[i].get("sender").id,
        recipient: results[i].get("recipient").id,
        message: results[i].get("data")
      }
      
      messages.push(data)
    }
    
    res.successT({
      messages: messages
    })
    
  }, function(error) {
    res.errorT({
      description: error.message
    })
  })
  
}


module.exports.getConversation = function(req, res) {
    var query = new Parse.Query(Conversation)
    query.containsAll("users", [nelson.id, currentUser.id])
    query.find().then(function(results){
      console.log("Conversation ID:  "+results[0].id)
      var relation = results[0].relation("messages")
      var mQuery = relation.query()
      return mQuery.find() 

    }).then(function(results){
      console.log("Messages:  "+results.length)
      for(var i = 0; i < results.length; i++) {
        console.log("Message:  "+results[i].get("data"))
      }
    })
}

module.exports.getAllConversations = function(req, res) {
  var Conversation = Parse.Object.extend("Conversation")
  var query = new Parse.Query(Conversation)
  var conversations = []
  query.equalTo("users", nelson.id)
  query.each(function(conversation) {
    var messages = []
    var relation = conversation.relation("messages")
    var mQuery = relation.query()
    
    return mQuery.each(function(message){
      messages.push(message.get("data"))
    }).then(function() {
      var data = {
        conversation: conversation,
        messages: messages
        
      }
      
      conversations.push(data)
      
    })
    
  }).then(function(){
    console.log(JSON.stringify(conversations))
  }, function(error){
    console.log(error.message)
  })
  
}

module.exports.updateConversation = function(req, res) {
  var conversation = new Conversation()
  conversation.id = currentConversationId
  
  conversation.fetch().then(function(){
    messages = conversation.get("messages")
    //update conversation screen
  })
}

module.exports.newMessageInConvo = function(req, res) {
  var message = new Message()
  message.set("data", "MESSAGE_HERE")
  message.set("sender", CURRENT_USER)
  message.set("recipient", RECIPIENT)
  
  var conversation =  currentConversation
  var relation = conversation.relation("messages")
  relation.add(message)
  conversation.save()
  
}
