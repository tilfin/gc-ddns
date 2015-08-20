var config = require('config').config;
var restify = require('restify');
var key = require(config.authKeyJsonFile);
var google = require('googleapis');

var API_SCOPES = [
  'https://www.googleapis.com/auth/ndev.clouddns.readwrite',
  'https://www.googleapis.com/auth/cloud-platform'
];


function GcDnsClient() {
  this.dnsClient = null;
}
GcDnsClient.prototype = {
  baseParams: function() {
    return {
        managedZone: config.managedZone,
        project: config.project
      };
  },

  listPromise: function(name, type) {
    var self = this;
    return self.dnsClientPromise()
      .then(function(dns) {
        var params = self.baseParams();
        if (name) params.name = name;
        if (type) params.type = type;

        return new Promise(function(resolve, reject) {
            dns.resourceRecordSets.list(params, function(err, resp) {
              if (err) {
                reject(err);
              } else {
                resolve(resp);
              }
            });
          });
      });
  },

  createPromise: function(host, ip, recordType, ttl, existing) {
    var self = this;
    return self.dnsClientPromise()
      .then(function(dns) {
        var resRecordSet = {
          kind: 'dns#resourceRecordSet',
          name: host,
          type: recordType,
          rrdatas: [ip],
          ttl: ttl
        };

        var params = self.baseParams();
        params.resource = {
          kind: 'dns#change',
          additions: [resRecordSet],
        };

        if (existing) {
          params.resource.deletions = [existing];
        }

        return new Promise(function(resolve, reject) {
            dns.changes.create(params, function(err, resp) {
              if (err) {
                reject(err);
              } else {
                resolve(resp);
              }
            });
          });
      });
  },

  dnsClientPromise: function() {
    if (this.dnsClient) {
      return Promise.resolve(this.dnsClient);
    }

    var self = this;
    return new Promise(function(resolve, reject) {
        var jwtClient = new google.auth.JWT(key.client_email, null, key.private_key, API_SCOPES, null);
        jwtClient.authorize(function(err, tokens) {
          if (err) {
            reject(err);
          } else {
            google.options({ auth: jwtClient });
            self.dnsClient = google.dns('v1');
            resolve(self.dnsClient);
          }
        });
      });
  }
}

module.exports = GcDnsClient;
