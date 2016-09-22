#!/usr/bin/env node

const program = require('commander');
const config = require('config').config;
const record = require('../model/record');
const GcDnsClient = require('../model/gcdns');
const CommonUtil = require('../util/common');

program
  .command('list')
  .description('list resource record sets')
  .action(function(){
    const client = new GcDnsClient();
    client.listPromise()
    .then(result => {
      console.log(JSON.stringify(result, null, 2));
    })
    .catch(err => {
      console.error(err);
    });
  });

program
  .command('register <host> <ip> [ttl]')
  .description('register A/AAAA record')
  .action(function(host, ip, ttl){
    const ipVersion = CommonUtil.validateIpVersion(ip);
    const recordType = CommonUtil.getAddressRecordType(ipVersion);
    if (recordType == null) {
      console.error('Invalid IP address');
      return;
    }

    const recordTtl = parseInt(ttl || config.ttl, 10);
    if (isNaN(recordTtl)) {
      console.error('Invalid TTL');
      return;
    }

    record.create(host, ip, recordType, recordTtl, function(err, result){
      console.log(JSON.stringify(result, null, 2));
    });
  });

program.parse(process.argv);
