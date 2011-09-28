Panda NodeJS client library
===========================

```
var panda = require('./panda')

var config = {
  accessKey: 'abcde',
  secretKey: 'fghij',
  cloudId: '12345'
}

var client = panda.createClient(config);
client.get('/profiles.json', {}, function(p){
  console.log(p[0].id)
});
```
