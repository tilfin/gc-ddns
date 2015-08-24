#!/usr/bin/env node
var program = require('commander');
var config = require('config').config;
var record = require('../model/record');
var GcDnsClient = require('../model/gcdns');
var CommonUtil = require('../util/common');

program
  .command('list')
  .description('list resource record sets')
  .action(function(){
    var client = new GcDnsClient();
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
    var ipVersion = CommonUtil.validateIpVersion(ip);
    var recordType = CommonUtil.getAddressRecordType(ipVersion);
    if (recordType == null) {
      console.log('Invalid IP address');
      return;
    }

    var recordTtl = parseInt(config.ttl || ttl, 10);
    if (isNaN(recordTtl)) {
      console.log('Invalid TTL');
      return;
    }

    record.create(host, ip, recordType, ttl, function(err, result){
      console.log(JSON.stringify(result, null, 2));
    });
  });

program.parse(process.argv);
