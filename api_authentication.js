var crypto = require('crypto');

function canonicalString(params){
	return "access_key=" + params.access_key + "&cloud_id=" + params.cloud_id + '&timestamp=' + params.timestamp;
}

generateSignature = function(method, uri, apiHost, secretKey, paramsToSign){
	var queryString = canonicalString(paramsToSign);
	var stringToSign = method + '\n' + apiHost+ '\n' + uri + '\n' + queryString;
	console.log(stringToSign)
	return crypto.createHmac('sha256', secretKey).update(stringToSign).digest('base64');
}

hashToQuery = function(params){
	return "access_key=" + params.access_key + 
		"&cloud_id=" + params.cloud_id + 
		'&timestamp=' + params.timestamp +
		'&signature=' + escape(params.signature);
}

exports.generateSignature = generateSignature
exports.hashToQuery = hashToQuery