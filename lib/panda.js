var auth = require('./api_authentication');
var sys = require('sys');
var http = require('http');
var https = require('https');

var Panda = function(_config) {
	var config = _config;
	var apiHost = config.apiHost || 'api.pandastream.com';
	var apiPort = config.apiPort || 80;
	
	function signedParams(method, uri, params){
		var timestamp = escape(new Date().toUTCString());
	  
		params['cloud_id'] = config.cloudId;
		params['access_key'] = config.accessKey;
		params['timestamp'] = timestamp;
		params['signature'] = auth.generateSignature(method, uri, apiHost, config.secretKey, params);
		return params;
	}
	
	function httpClient() {
	  if(apiPort ==   80)
	    return http;
	  else
	    return https;
	}
		
	client = {
		get: function(uri, params, cb){
			params = {}
			query = auth.hashToQuery(signedParams('GET', uri, params))
			
			request_uri = '/v2' + uri;
			options = {
			  host: apiHost,
			  port: apiPort,
			  path: request_uri + '?' + query,
			  method: 'GET'
			};
			
			var request = httpClient().request(options, function(res) {
			  res.setEncoding('utf8');
			  var body = ''
				
				res.addListener("data", function (data) {  
				   body += data;  
				});
				
			  res.addListener('end', function (chunk) {
					cb(JSON.parse(body))
			  });
			
			});			

			request.end();
		}
	}
	
	return client;
}

exports.createClient = Panda