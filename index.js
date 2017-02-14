var fs = require('fs');
var path = require('path')
var _ = require('lodash')
var unzip = require('unzip')

/**
 * 返回类型限定
 * @enum {function}
 */
const RETURN_TYPES = {
  array: Array,
  object: Object
}

/**
 * 获取zip文件的目录文件结构
 * @param {string} file 文件路径
 * @param {Object=} opt 可选参数 
 * @param {RETURN_TYPES=} [opt.return=Array] 以数组或对象形式返回结果
 * @return {Promise}
 */
function listEntries(file,opt){
  opt = _.extend({
    return:Array
  },opt)

  return new Promise(function(resolve,reject){
    var entries = [];
    var srcStream = fs.createReadStream(file);
    srcStream.pipe(unzip.Parse())
    .on('entry', function(entry) {
      entries.push(entry.path);
      entry.autodrain();
    })
    .on('close', function() {
      if(opt.return === RETURN_TYPES.object){
        resolve(entrylist2obj(entries))
      }else{
        resolve(entries)
      }
    })
    .on('error', function(err){
      reject(err)
    })
  })
}

/**
 * 将数组形式的列表结构转换为对象结构
 * @param {string[]} entries
 * @return {Object}
 */
function entrylist2obj(entries){
  return entries.reduce(function(result,current){
    var isDir = current.endsWith('/')
    if(isDir){
      addDir(result,current.split('/'))
    }else{
      addFile(result,current.split('/'))
    }
    return result
  },{})

  /**
   * 补充一个目录的结构
   * @param {Object} result 目录结构对象
   * @param {string[]} pathArr 路径数组
   * @return {Object} 末端的文件夹
   */
  function addDir(result,pathArr){    
    return pathArr.reduce(function(tmp,x,index){
      if(x){
        !tmp[x] && (tmp[x] = {})
        return tmp[x]
      }else{
        return tmp
      }
      
    },result)    
  }

  /**
   * 补充一个文件的结构
   * @param {Object} result 目录结构对象
   * @param {string[]} pathArr 路径数组
   */
  function addFile(result,pathArr){
    var filename = pathArr[pathArr.length-1]
    var dirArr = pathArr.reduce((arr,x,index)=>{
      if(index !== pathArr.length-1){
        arr.push(x)
      }
      return arr
    },[])
    
    var finalDir = addDir(result,dirArr)
    finalDir[filename] = pathArr.join('/')
  }  
}

module.exports = listEntries