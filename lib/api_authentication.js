var crypto = require('crypto');

function canonicalString(params){
  var index = []
  var index2 = []
  
  for (var i in params) {
    index.push(i)
  }
  
  index.sort()
  for (var i in index) {
    key = index[i]
    index2.push(key + "=" + escape(params[key]))
  }
  return index2.join("&")
}

generateSignature = function(method, uri, apiHost, secretKey, paramsToSign){
	var queryString = canonicalString(paramsToSign);
	var stringToSign = method + '\n' + apiHost+ '\n' + uri + '\n' + queryString;
	signature =  crypto.createHmac('sha256', secretKey).update(stringToSign).digest('base64');
	console.log(stringToSign)
	console.log(signature.trim())
	return signature
}

hashToQuery = function(params){
  var index = []
  for (var i in params) {
    index.push(i + "=" + escape(params[i]));
  }
  return index.join("&")
}

exports.generateSignature = generateSignature
exports.hashToQuery = hashToQuery