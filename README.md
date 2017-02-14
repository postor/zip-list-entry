# zip-list-entry
list entry from zip file | 从zip文件获取完整的目录文件结构
## install | 安装
```
npm install zip-list-entry --save
```
## usage | 使用
```
var listEntries = require('zip-list-entry')
var path = require('path')
var file = path.join(__dirname,'test.zip')

listEntries(file,{
  return: Object
}).then(function(entries){
  console.log(JSON.stringify(entries))
},function(err){
  console.log(err)
})
```

## result | 结果
```
//return: Array
["1/","1/a/","1/a/x/","1/a/x/a.txt","1/b/","1/c/","2/","3/","test.js"]
//return: Object
{"1":{"a":{"x":{"a.txt":"1/a/x/a.txt"}},"b":{},"c":{}},"2":{},"3":{},"test.js":"test.js"}
```
