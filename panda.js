var auth = require('./api_authentication');
var sys = require('sys');
var http = require('http');

var Client = function(_config) {
	var config = _config;
	var apiHost = 'staging.pandastream.com';
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
		get: function(uri, params){
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
			  console.log('STATUS: ' + res.statusCode);
			  console.log('HEADERS: ' + JSON.stringify(res.headers));
			  res.setEncoding('utf8');
			  res.on('data', function (chunk) {
			    console.log('BODY: ' + chunk);
			  });
			});			

			request.end();
		}
	}
	
	return client;
}

exports.Client = Client