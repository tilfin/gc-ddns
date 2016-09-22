'use strict';

const config = require('config').config;
const restify = require('restify');
const resource = require('./resource');

const server = restify.createServer({
  name: 'Dynamic DNS API Service for Google Cloud'
});

server.use(restify.requestLogger());
server.use(restify.queryParser());
server.use(restify.bodyParser({ mapParams: true }));

resource(server);

if (!module.parent) {
  const port = process.env.PORT || config.app.port;
  server.listen(port);
  console.log("Start API Service port: %d", port);
}
