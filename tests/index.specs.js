var assert = require("assert");
var hapiPostman = require('../index.js');
var Hapi = require('hapi');

describe('hapi-postman', function() {

    describe('#register()', function() {
        it('should scan the server for routes, and create a postman collection', function() {
            var server = new Hapi.Server();

            server.connection({
                port: 12345
            });

            server.register([{
                    register: require('../index.js')
                }],
                function(err) {
                    if (err) {
                        console.error('Failed to load plugin: ', err);
                    }
                });

            server.start();

        });
    });
});