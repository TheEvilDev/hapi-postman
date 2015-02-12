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

var PostmanRequest = function(name, description, url, method, headers, data, dataMode) {
    var _requestId = uuid.v4();
    return {
        collectionId: null,
        id: _requestId,
        name: name,
        description: description,
        url: url,
        method: method,
        headers: headers || "",
        data: data || [],
        dataMode: dataMode || "params",
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

var getRoutesData = function(connections) {

    var requests = [];

    for (var i = 0; i < connections.length; i++) {
        for (var j = 0; j < connections[i].table.length; j++) {
            console.log("Connection: ", connections[i]);
            console.log('Route Table: ', connections[i].table[j]);
            var route = connections[i].table[j];
            requests.push(new PostmanRequest(route.path.replace('/', ' ').trim(), route.settings.description || '', connections[i].info.uri + route.path, route.method));
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
            console.log('Server Table', server.table());
            var routeData = getRoutesData(server.table());

            var collection = new PostmanCollection('Awesome', routeData);
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