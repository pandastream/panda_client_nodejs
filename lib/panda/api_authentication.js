var crypto = require('crypto');

function canonicalString(params){
  var index = [];
  var index2 = [];

  Object.keys(params).forEach(function(key) {
    index.push(key);
  });

  delete index['file'];
  
  index.sort();

  index.forEach(function(key) {
    index2.push(key + "=" + encodeURIComponent(params[key])
                            .replace(/\(/g, "%28")
                            .replace(/\)/g, "%29")
                            .replace(/!/g, "%21")
                            .replace(/'/g, "%27")
                            .replace(/\*/g, "%2A"))
  });

  return index2.join("&");
}

function generateSignature(method, uri, apiHost, secretKey, paramsToSign){
	var queryString = canonicalString(paramsToSign);
	var stringToSign = method + '\n' + apiHost+ '\n' + uri + '\n' + queryString;
	var signature =  crypto.createHmac('sha256', secretKey).update(stringToSign).digest('base64');
	return signature
}

function hashToQuery(params){
  var index = [];
  for (var i in params) {
    index.push(i + "=" + encodeURIComponent(params[i]));
  }
  return index.join("&")
}

module.exports = {
    generateSignature: generateSignature,
    hashToQuery: hashToQuery
};