var restify = require('restify');
var GcDnsClient = require('../model/gcdns');


exports.create = function(host, ip, recordType, ttl, callback) {
  var client = new GcDnsClient();
  client.listPromise(host, recordType)
  .then(function(resp) {
    return (resp.rrsets.length == 1) ? resp.rrsets[0] : null;
  })
  .then(function(existingRecord) {
    return client.createPromise(host, ip, recordType, ttl, existingRecord);
  })
  .then(function(resp) {
    callback(null, resp);
  })
  .catch(function(err) {
    console.log(err);
    console.log(err.stack);
    callback(err);
  });
}
