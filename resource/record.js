'use strict';

const restify = require('restify');
const config = require('config').config;
const CommonUtil = require('../util/common');
const record = require('../model/record');


function authorize(req, res, next) {
  const apiKey = req.params.key;
  if (apiKey == config.app.apiKey) {
    return true;
  } else {
    next(new restify.errors.InvalidCredentialsError("Invaild API Key"));
    return false;
  }
}

exports.post = function(req, res, next) {
  if (!authorize(req, res, next)) {
    return;
  }

  const host = req.params.host;
  if (!host) {
    next(new restify.errors.BadRequestError('Invalid host'));
    return;
  }

  const ip = req.params.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  const ipVersion = CommonUtil.validateIpVersion(ip);
  const recordType = CommonUtil.getAddressRecordType(ipVersion);
  if (recordType == null) {
    next(new restify.errors.BadRequestError('Invalid IP address'));
    return;
  }

  const recordTtl = parseInt(req.params.ttl || config.ttl, 10);
  if (isNaN(recordTtl)) {
    next(new restify.errors.BadRequestError('Invalid TTL'));
    return;
  }

  record.create(host, ip, recordType, recordTtl, (err, result) => {
    if (err) {
      console.log(err);
      return next(err);
    }

    res.json(result);
  });
}
