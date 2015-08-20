var restify = require('restify');
var config = require('config').config;
var record = require('../model/record');


function authorize(req, res, next) {
  var apiKey = req.params.key;
  if (apiKey == config.apiKey) {
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

  var host = req.params.host;
  if (!host) {
    next(new restify.errors.BadRequestError('Invalid host'));
    return;
  }
  host += '.' + config.domain + '.';

  var ip = req.params.ip;
  if (!ip.match(/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/)) {
    next(new restify.errors.BadRequestError('Invalid IP address'));
    return;
  }

  var recordType = req.params.type || 'A';

  var recordTtl = parseInt(req.params.ttl || config.ttl, 10);
  if (isNaN(recordTtl)) {
    next(new restify.errors.BadRequestError('Invalid TTL'));
    return;
  }

  record.create(host, ip, recordType, recordTtl, function(err, result) {
    if (err) {
      console.log(err);
      return next(err);
    }

    res.json(result);
  });
}