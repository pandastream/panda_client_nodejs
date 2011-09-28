if (global.GENTLY) require = GENTLY.hijack(require)

var auth = require('./api_authentication');
var sys = require('sys');
var http = require('http');
var https = require('https');

function toISO8601(date) {
    var pad_two = function(n) {
        return (n < 10 ? '0' : '') + n;
    };
    var pad_three = function(n) {
        return (n < 100 ? '0' : '') + (n < 10 ? '0' : '') + n;
    };
    return [
        date.getUTCFullYear(),
        '-',
        pad_two(date.getUTCMonth() + 1),
        '-',
        pad_two(date.getUTCDate()),
        'T',
        pad_two(date.getUTCHours()),
        ':',
        pad_two(date.getUTCMinutes()),
        ':',
        pad_two(date.getUTCSeconds()),
        '.',
        pad_three(date.getUTCMilliseconds()),
        'Z',
    ].join('');
}

var Panda = function(_config) {
	var config = _config;
	var apiHost = config.apiHost || 'api.pandastream.com';
        var apiScheme = config.apiScheme;
	var apiPort = config.apiPort;
        if (!apiScheme && apiPort) {
          apiScheme = (apiPort == 80 ? "http" : "https");
        } else if (!apiPort && apiScheme) {
          apiPort = (apiScheme == "https" ? 443 : 80);
        } else {
          apiPort = 443;
          apiScheme = "https";
        }
	
	function signedParams(method, uri, params){
		var timestamp = toISO8601(new Date());
	  
		params['cloud_id'] = config.cloudId;
		params['access_key'] = config.accessKey;
		params['timestamp'] = timestamp;
		params['signature'] = auth.generateSignature(method, uri, apiHost, config.secretKey, params);
		return params;
	}
	
	function httpClient() {
          if (apiScheme == "http")
	    return http;
	  else
	    return https;
	}
		
	function queryOptions(verb, uri, params) {
	  var query = auth.hashToQuery(signedParams(verb, uri, params))
		var request_uri = '/v2' + uri;

		return {
		  host: apiHost,
		  port: apiPort,
		  path: request_uri + '?' + query,
		  method: verb
		};
	}
	
	function makeRequest(options,cb) {
	  	var request = httpClient().request(req_options, function(res) {
			  res.setEncoding('utf8');
			  var body = ''
				res.addListener("data", function (data) {
				   body += data;  
				});
			  res.addListener('end', function (chunk) {
			    if(cb)
					  cb(JSON.parse(body))
			  });
			});
			request.end();
	}
	
	client = {
		get: function(uri, params, cb){
			req_options = queryOptions('GET', uri, params);
			makeRequest(req_options, cb);
		},
		
		post: function(uri, params, cb){
			req_options = queryOptions('POST', uri, params);
			makeRequest(req_options, cb);
		},
		
		put: function(uri, params, cb){
			req_options = queryOptions('PUT', uri, params);
			makeRequest(req_options, cb);
		},
		
		delete: function(uri, params, cb){
			req_options = queryOptions('DELETE', uri, params);
			makeRequest(req_options, cb);
		}
	}
	
	return client;
}

exports.createClient = Panda