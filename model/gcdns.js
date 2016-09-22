'use strict';

const config = require('config').config.googleCloud;
const google = require('googleapis');


function GcDnsClient() {
  this.dnsClient = null;
  this.FQDNSuffix = '.' + config.dns.domain + '.';
}
GcDnsClient.prototype = {
  baseParams: function() {
    return {
        managedZone: config.dns.zone,
        project: config.project
      };
  },

  listPromise: function(host, type) {
    return this.dnsClientPromise()
      .then(dns => {
        const params = this.baseParams();
        if (host) {
          params.name = host + this.FQDNSuffix;
        }
        if (type) params.type = type;

        return new Promise((resolve, reject) => {
            dns.resourceRecordSets.list(params, (err, resp) => {
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
    return this.dnsClientPromise()
      .then(dns => {
        const resRecordSet = {
          kind: 'dns#resourceRecordSet',
          name: host + this.FQDNSuffix,
          type: recordType,
          rrdatas: [ip],
          ttl: ttl
        };

        const params = this.baseParams();
        params.resource = {
          kind: 'dns#change',
          additions: [resRecordSet],
        };

        if (existing) {
          params.resource.deletions = [existing];
        }

        return new Promise((resolve, reject) => {
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

    return new Promise((resolve, reject) => {
        const API_SCOPES = [
          'https://www.googleapis.com/auth/ndev.clouddns.readwrite',
          'https://www.googleapis.com/auth/cloud-platform'
        ];

        const key = require(config.authKeyJsonFile);

        const jwtClient = new google.auth.JWT(key.client_email, null, key.private_key, API_SCOPES, null);
        jwtClient.authorize((err, tokens) => {
          if (err) {
            reject(err);
          } else {
            google.options({ auth: jwtClient });
            this.dnsClient = google.dns('v1');
            resolve(this.dnsClient);
          }
        });
      });
  }
}

module.exports = GcDnsClient;
