var crypto = require('crypto');

function canonicalString(params){
  var index = []
  var index2 = []
  
  for (var i in params) {
    index.push(i)
  }
  
  delete index['file']
  
  index.sort()
  for (var i in index) {
    key = index[i]
    index2.push(key + "=" + encodeURIComponent(params[key]).replace(/\(/g, "%28").replace(/\)/g, "%29"))
  }
  return index2.join("&")
}

generateSignature = function(method, uri, apiHost, secretKey, paramsToSign){
	var queryString = canonicalString(paramsToSign);
	var stringToSign = method + '\n' + apiHost+ '\n' + uri + '\n' + queryString;
	signature =  crypto.createHmac('sha256', secretKey).update(stringToSign).digest('base64');
	return signature
}

hashToQuery = function(params){
  var index = []
  for (var i in params) {
    index.push(i + "=" + encodeURIComponent(params[i]));
  }
  return index.join("&")
}

exports.generateSignature = generateSignature
exports.hashToQuery = hashToQuery