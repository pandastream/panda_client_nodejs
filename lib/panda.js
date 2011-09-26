var auth = require('./api_authentication');
var sys = require('sys');
var http = require('http');

var Panda = function(_config) {
	var config = _config;
	var apiHost = 'api.pandastream.com';
	var apiPort = '443';
	
	function signedParams(method, uri, params){
		var timestamp = escape(new Date().toUTCString());
	  
		params['cloud_id'] = config.cloudId;
		params['access_key'] = config.accessKey;
		params['timestamp'] = timestamp;
		params['signature'] = auth.generateSignature(method, uri, apiHost, config.secretKey, params);
		return params;
	}
	
	function apiScheme(){
		return 'https';
	}
	
	function apiUrl(){
		return apiScheme() + "://" + apiHost + ":" + apiPort + "/v2";
	}
	
	function httpClient(){
		return http.createClient(80, apiHost);	
	}
	
	client = {
		get: function(uri, params, cb){
			params = {}
			query = auth.hashToQuery(signedParams('GET', uri, params))
			
			request_uri = '/v2' + uri;
			options = {
			  host: 'staging.pandastream.com',
			  port: 80,
			  path: request_uri + '?' + query,
			  method: 'GET'
			};
			
			var request = http.request(options, function(res) {
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