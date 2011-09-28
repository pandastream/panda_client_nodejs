var path = require('path')
require.paths.unshift(path.dirname(__dirname)+'/lib/panda');

var timestamp_string = "2011-09-26T09:35:57-04:00"
var timestamp = new Date(Date.parse(timestamp_string))
var oldDatePrototype = Date.prototype;

global.Date = function(){
  return timestamp
}
global.Date.prototype = oldDatePrototype;
