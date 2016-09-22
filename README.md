gc-ddns
=======

Dynamic DNS API Service for Google Cloud

This is a hub service to connect dynamic IP address endpoint as a home network at any time.
Your DNS record on Google Cloud is updated by posting this service from Home PC periodically.

## Environment

Node.js 4.3 or Later

## Configuration
Edit _config/local.yml_

```
config:
  app:
    apiKey: <API service key>
  googleCloud:
    project: <project name>
    authKeyJsonFile: <auth json file path>
    dns:
      zone: <zone name>
      domain: <domain>
```

- _authKeyJsonFile_ is provided by authentication page at Google Cloud Console.

## Setup and Start API service

```
$ git clone git@github.com:tilfin/gc-ddns.git
$ cd gc-ddns
$ npm install
$ node app.js
```

## How to update A/AAAA record

### Linux/OS X

```
$ curl -X POST \
    -d 'host=<Host name>&ip=<IP Address>&key=<API service key>&ttl=<TTL>' \
    http://localhost:8080/records
```

### Windows PowerShell

```
PS > Invoke-RestMethod http://localhost:8080/records `
    -Method POST `
    -Body "host=<Host name>&ip=<IP Address>&key=<API service key>&ttl=<TTL>" `
```

- Service port is config.app.port (default 8080)
- Default TTL is config.ttl
- Specify request source host IP address if _ip_ is not specified
- Recommend to access API Service via HTTPS (using nginx as a reverse proxy)

