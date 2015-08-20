gc-ddns
=======

Dynamic DNS API Service for Google Cloud


## Configuration
Edit _config/local.yml_

```
config:
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

```
$ curl -X POST -d 'host=<Host name>&ip=<IP Address>&key=<API service key>' http://localhost:8080/records
```

- Specify request source host IP address if _ip_ is not specified
- Recommend to access API Service via HTTPS
