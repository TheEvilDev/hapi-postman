var uuid = require('node-uuid');

var PostmanCollection = function(name, requests) {

    var _collectionId = uuid.v4();

    for (var i = 0; i < requests.length; i++) {
        requests[i].collectionId = _collectionId;
    }

    return {
        id: _collectionId,
        name: name,
        timestamp: new Date().getTime(),
        requests: requests
    };
};

var PostmanRequest = function(name, description, url, method, headers) {
    var _requestId = uuid.v4();
    return {
        collectionId: null,
        id: _requestId,
        name: name,
        description: description,
        url: url,
        method: method,
        headers: headers || "",
        data: [],
        dataMode: "params",
        timestamp: new Date().getTime()
    };
};

var getConnections = function(server) {
    var routeTable = server.table;
    var connections = [];

    for (var i = 0; i < routeTable.length; i++) {
        connections.push(server.table[i]);
    }

    return connections;
};

var getRoutesData = function(connections, baseUri) {

    var requests = [];

    for (var i = 0; i < connections.length; i++) {
        for (var j = 0; j < connections[i].table.length; j++) {
            var base = baseUri === undefined ? connections[i].info.uri : baseUri;
            var route = connections[i].table[j];
            var postmanSettings = route.settings.plugins.postman || null;

            var postmanRequest = new PostmanRequest(route.path.replace('/', ' ').trim(),
                route.settings.description || '',
                base + route.path,
                route.method);

            if (postmanSettings !== null) {
                var data = postmanSettings.data || null;
                if (data !== null) {
                    postmanRequest.dataMode = 'raw';
                    postmanRequest.data = JSON.stringify(data);
                }
            }
            requests.push(postmanRequest);
        }
    }

    return requests;
};

exports.register = function(server, options, next) {
    endpoint = options.endpoint || '/postman';
    name = options.name;

    server.route({
        method: 'GET',
        path: endpoint,
        handler: function(request, reply) {
            var routeData = getRoutesData(server.table(), options.baseUri);

            var collection = new PostmanCollection(options.collection || uuid.v4(), routeData);
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