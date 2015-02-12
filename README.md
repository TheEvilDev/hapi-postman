# hapi-postman

A simple hapi plugin that exposes endpoint metadata as a postman collection so your api can be easily
tested using postman.

See: http://www.getpostman.com/

## Installation

Simply install with npm and go!

    npm install hapi-postman

### Usage
Simply register the plugin with your hapi server, and configure the optional overrides.

### Example
```javascript
    var server = new Hapi.Server();

    server.connection({
      port: 3001
    });

    server.register({
        register: require('hapi-postman'),
        options: {
            endpoint: '/metadata', // Default: postman
            collection: 'Awesome Collection', // Default: Random GUID
            baseUri: 'http://localhost:12345' // Default: connection.info.uri
        }
      },
      function(err) {
        if (err) {
          console.error('Failed to load plugin: ', err);
        }
      });

    server.start();
```

You can additionally, provide postman with a sample data body during route creation:

```javascript
server.route({
    method: 'POST',
    path: '/test',
    handler: function(request, reply) {
        reply('Hello World!');
    },
    config: {
        description: 'Test endpoint for demo purposes <strong>Postman Descriptions also support html</strong>',
        plugins: {
            postman: {
                data: { // JSON Object in whatever format you want, this will be what postman is told is a sample request body.
                    message: 'Something cool',
                    timestamp: new Date().getTime()
                }
            }
        }
    }
});
```
