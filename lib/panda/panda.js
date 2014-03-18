if (global.GENTLY) require = GENTLY.hijack(require);

var auth = require('./api_authentication');
var sys = require('sys');
var http = require('http');
var https = require('https');

function merge(dest, src) {
  for (var k in src) {
    dest[k] = src[k];
  };
}

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

var Panda = function(config) {
  if (!(this instanceof Panda)) {
    return new Panda(config)
  }

  merge(this, config);
  if (!this.apiHost) this.apiHost = "api.pandastream.com";
  if (!this.apiScheme && this.apiPort) {
    this.apiScheme = (this.apiPort == 80 ? "http" : "https");
  } else if (!this.apiPort && this.apiScheme) {
    this.apiPort = (this.apiScheme == "https" ? 443 : 80);
  } else {
    this.apiPort = 443;
    this.apiScheme = "https";
  }
}

merge(Panda.prototype, {
  // Panda access config
  apiHost: null,
  apiScheme: null,
  apiPort: null,

  // Panda Account settings
  accessKey: null,
  secretKey: null,
  cloudId: null,

  // Sends a GET request ot panda
  get: function(uri, params, cb){
    var req_options = this.queryOptions('GET', uri, params);
    this.makeRequest(req_options, cb);
  },

  // Sends a POST request to panda
  post: function(uri, params, cb){
    var req_options = this.queryOptions('POST', uri, params);
    this.makeRequest(req_options, cb);
  },

  // Sends a PUT request to panda
  put: function(uri, params, cb){
    var req_options = this.queryOptions('PUT', uri, params);
    this.makeRequest(req_options, cb);
  },

  // Sends a DELETE request to panda
  delete: function(uri, params, cb){
    var req_options = this.queryOptions('DELETE', uri, params);
    this.makeRequest(req_options, cb);
  },

  // Completes the uri query with the signed parameters
  signedParams: function(method, uri, params){
    var timestamp = toISO8601(new Date());

    params = params || {}
    params['cloud_id'] = this.cloudId;
    params['access_key'] = this.accessKey;
    params['timestamp'] = timestamp;
    params['signature'] = auth.generateSignature(method, uri, this.apiHost, this.secretKey, params);
    return params;
  },

  makeRequest: function (options,cb) {
    var request = this.httpClient().request(options, function(res) {
      res.setEncoding('utf8');
      var body = '';
      res.addListener("data", function (data) {
        body += data;
      });
      res.addListener('end', function (chunk) {
        if(cb) {
          if (body) {
            cb(JSON.parse(body))
          } else {
            cb({error: 'requestError', message: 'Empty response body'});
          }
        }
      });
      res.addListener('error', function(err) {
        if (cb) {
          cb({error: 'requestError', message: err.message});
        }
      });
    });
     request.end();
  },

  queryOptions: function(verb, uri, params) {
    var query = auth.hashToQuery(this.signedParams(verb, uri, params));
    var request_uri = '/v2' + uri;

    return {
      host: this.apiHost,
      port: this.apiPort,
      path: request_uri + '?' + query,
      method: verb,
      headers: {
        'Content-Length': 0
      }
    };
  },

  httpClient: function() {
    if (this.apiScheme == "http")
      return http;
    else
      return https;
  }
});

exports.Panda = Panda;
exports.createClient = Panda;
