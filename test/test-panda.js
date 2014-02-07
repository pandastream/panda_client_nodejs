var panda = require('../index.js');
var fs = require('fs');
var path = require('path');

var client;

if (!process.listeners('uncaughtException').length) {
    process.on('uncaughtException', function(err) {
        throw err;
    });
}

exports.setUp = function(callback) {
    var configPath = path.join(__dirname,'config.json');
    var config;

    if (!fs.existsSync(configPath)) {
        var message = 'Need panda configuration at '+configPath+' to test\n'
                    + 'Please create JSON file with configuration to be passed to panda client';

        console.log(message);
        return callback(new Error(message));
    }
    try {
        config = JSON.parse(fs.readFileSync(configPath));
    } catch(err) {
        return callback(err);
    }

    client = panda.createClient(config);

    callback();
};

exports.testAuthorizeUpload = function(test) {

    var testPayload = {
        content_type: 'application/octet-stream',
        file_name: 'dummyMovie.mp4',
        file_size: 1234567,
        payload: JSON.stringify({
            simpleString: 'hello',
            fancyString: '~`!@#$%^&*()-_+={}[]|\\/<>,.\'"é'
        })
    };

    test.expect(1);
    try {
        client.post('/videos/upload.json', testPayload, function(result) {
            if (result.error) {
                throw new Error(result.error+' -- '+result.message);
            }
            test.ok(result.location);
            test.done();
        });
    } catch (err) {
        console.log(err);
        throw err;
    }
};