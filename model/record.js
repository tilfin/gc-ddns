'use strict';

const restify = require('restify');
const GcDnsClient = require('../model/gcdns');


exports.create = function(host, ip, recordType, ttl, callback) {
  const client = new GcDnsClient();
  client.listPromise(host, recordType)
  .then(resp => {
    return (resp.rrsets.length == 1) ? resp.rrsets[0] : null;
  })
  .then(existingRecord => {
    if (existingRecord && existingRecord.rrdatas[0] == ip) {
      return {
          message: 'IP address is unchanged.'
        };
    }
    return client.createPromise(host, ip, recordType, ttl, existingRecord);
  })
  .then(resp => {
    callback(null, resp);
  })
  .catch(err => {
    console.log(err);
    console.log(err.stack);
    callback(err);
  });
}
