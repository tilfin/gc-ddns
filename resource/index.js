'use strict';

const record = require('./record');

module.exports = function(server) {
  server.post('/records', record.post);
}
