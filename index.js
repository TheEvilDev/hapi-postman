var uuid = require('node-uuid');

var PostmanCollection = function(name, requests) {

    var _collectionId = uuid.v4();

    for (var i = 0; i < requests.length; i++) {
        request.collectionId = _collectionId;
    }

    return {
        id: _collectionId,
        name: name,
        timestamp: new Date().getTime(),
        requests: requests
    };
};

var PostmanRequest = function(name, description, url, method, headers, data, dataMode) {
    var _requestId = uuid.v4();
    return {
        collectionId: null,
        id: _requestId,
        name: name,
        description: description,
        url: url,
        method: method,
        headers: headers,
        data: data,
        dataMode: dataMode,
        timestamp: new Date().getTime()
    };
};

exports.register = function(server, options, next) {
    endpoint = options.endpoint || '/postman';

    server.route({
        method: 'GET',
        path: endpoint,
        handler: function(request, reply) {
            var endpoint = new PostmanRequest('Test', 'Test Endpoint', 'http://localhost', '/test');
            var collection = new PostmanCollection('TestCollection', [endpoint]);
            reply(collection);
        },
        config: {
            description: 'Exposes api metadata that can be imported directly into postman'
        }
    });

    next();
};

exports.register.attributes = {
    pkg: require('./package.json')
};