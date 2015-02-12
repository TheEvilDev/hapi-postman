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
          endpoint: '/postmanRocks' // Default: /postman
        }
      },
      function(err) {
        if (err) {
          console.error('Failed to load plugin: ', err);
        }
      });

    server.start();
```
