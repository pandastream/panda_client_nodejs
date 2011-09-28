var gently = global.GENTLY = new (require('gently'))
var panda = require('panda')

describe('authentication', function(){
  it('should get profiles', function(){

    var config = {
      accessKey: 'abcdefgh',
      secretKey: 'ijklmnop',
      cloudId: '123456789'
    }
    
    gently.expect(gently.hijacked.https, 'request', function(params, callback){
      expected_params = { 
        host : 'api.pandastream.com', 
        port : 443, 
        path : '/v2/profiles.json?cloud_id=123456789&access_key=abcdefgh&timestamp=2011-09-26T13%3A35%3A57.000Z&signature=sKnL9pjj5YB%2FMM%2B5Oh0cQIV%2B%2FyuNWJJirVYd9D7yssk%3D', method : 'GET' }
      expect(params).toEqual(expected_params)
      
      return {'end': function(){}}
    })

    var client = panda.createClient(config);
    client.get('/profiles.json', {});
  });
  
  it('should get profiles from other region and other port', function(){
    var config = {
      accessKey: 'abcdefgh',
      secretKey: 'ijklmnop',
      cloudId: '123456789',
      apiHost: 'api-eu.pandastream.com',
      apiPort: 80
    }
    
    gently.expect(gently.hijacked.http, 'request', function(params, callback){
      expected_params = { 
        host : 'api-eu.pandastream.com', 
        port : 80, 
        path : '/v2/profiles.json?cloud_id=123456789&access_key=abcdefgh&timestamp=2011-09-26T13%3A35%3A57.000Z&signature=dO5aLQTo4uHjOF70CymKia25Cc8%2Fz%2FyF910BloMdlaY%3D', method : 'GET' }
      expect(params).toEqual(expected_params)
      
      return {'end': function(){}}
    })

    var client = panda.createClient(config);
    client.get('/profiles.json', {});
  });
  
  it('should post a profile', function(){

    var config = {
      accessKey: 'abcdefgh',
      secretKey: 'ijklmnop',
      cloudId: '123456789'
    }
    
    gently.expect(gently.hijacked.https, 'request', function(params, callback){
      expected_params = { 
        host : 'api.pandastream.com', 
        port : 443, 
        path : '/v2/profiles.json?preset_name=h264&cloud_id=123456789&access_key=abcdefgh&timestamp=2011-09-26T13%3A35%3A57.000Z&signature=V44Eet5227ISDFw1cVjULlFA09MO0MQErLqvG7B2K6g%3D', method : 'POST' }
      expect(params).toEqual(expected_params)
      
      return {'end': function(){}}
    })

    var client = panda.createClient(config);
    client.post('/profiles.json', {'preset_name': 'h264'});
  });
  
  it('should update a profile', function(){

    var config = {
      accessKey: 'abcdefgh',
      secretKey: 'ijklmnop',
      cloudId: '123456789'
    }
    
    gently.expect(gently.hijacked.https, 'request', function(params, callback){
      expected_params = { 
        host : 'api.pandastream.com', 
        port : 443, 
        path : '/v2/profiles.json?width=800&cloud_id=123456789&access_key=abcdefgh&timestamp=2011-09-26T13%3A35%3A57.000Z&signature=1v4g1UOkOtAD3sFiLClym3rI1LpZ80Xh50X3C4FXiKM%3D', method : 'PUT' }
      expect(params).toEqual(expected_params)
      
      return {'end': function(){}}
    })

    var client = panda.createClient(config);
    client.put('/profiles.json', {'width': 800});
  });
  
});
