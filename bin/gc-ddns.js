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
    .then(function(result){
      console.log(JSON.stringify(result, null, 2));
    })
    .catch(function(err){
      console.log(err)
    });
  });

program
  .command('register <host> <ip> [ttl]')
  .description('register A/AAAA record')
  .action(function(host, ip, ttl){
    const ipVersion = CommonUtil.validateIpVersion(ip);
    const recordType = CommonUtil.getAddressRecordType(ipVersion);
    if (recordType == null) {
      console.log('Invalid IP address');
      return;
    }

    const recordTtl = parseInt(config.ttl || ttl, 10);
    if (isNaN(recordTtl)) {
      console.log('Invalid TTL');
      return;
    }

    record.create(host, ip, recordType, ttl, function(err, result){
      console.log(JSON.stringify(result, null, 2));
    });
  });

program.parse(process.argv);
