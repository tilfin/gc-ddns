var config = require('config').config;
var restify = require('restify');
var resource = require('./resource');

var server = restify.createServer({
  name: 'Dynamic DNS API Service for Google Cloud'
});

server.use(restify.requestLogger());
server.use(restify.queryParser());
server.use(restify.bodyParser({ mapParams: true }));

resource(server);

if (!module.parent) {
  var port = process.env.PORT || config.app.port;
  server.listen(port);
  console.log("Start API Service port: %d", port);
}
