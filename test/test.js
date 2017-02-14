var listEntries = require('../index')
var path = require('path')
var file = path.join(__dirname,'test.zip')

listEntries(file,{
  return: Object
}).then(function(entries){
  console.log(JSON.stringify(entries))
},function(err){
  console.log(err)
})