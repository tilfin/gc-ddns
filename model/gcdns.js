var config = require('config').config;
var restify = require('restify');
var key = require(config.authKeyJsonFile);
var google = require('googleapis');

var API_SCOPES = [
  'https://www.googleapis.com/auth/ndev.clouddns.readwrite',
  'https://www.googleapis.com/auth/cloud-platform'
];

function callCreateRecordAPI(host, ip, recordType, ttl, callback) {
  var jwtClient = new google.auth.JWT(key.client_email, null, key.private_key, API_SCOPES, null);
  jwtClient.authorize(function(err, tokens) {
    if (err) {
      callback(err, null);
      return;
    }

    google.options({ auth: jwtClient });

    var dns = google.dns('v1');

    var resRecordSet = {
      kind: 'dns#resourceRecordSet',
      name: host,
      type: recordType,
      rrdatas: [ip],
      ttl: ttl
    };

    var params = {
      managedZone: config.managedZone,
      project: config.project,
      resource: {
        kind: 'dns#change',
        additions: [resRecordSet],
      }
    };

    dns.changes.create(params, function(err, resp) {
      if (err) {
        callback(err, null);
        return;
      }

      callback(null, resp);
    });
  });
}

exports.createRecord = callCreateRecordAPI;
