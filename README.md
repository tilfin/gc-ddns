gc-ddns
=======

Dynamic DNS API Service for Google Cloud


# Configuration

config/local.yml

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

- **authKeyJsonFile** is provided by authentication page at Google Cloud Console.

# Setup and Start API service

```
$ git clone git@github.com:tilfin/gc-ddns.git
$ cd gc-ddns
$ npm install
$ node app.js
```

# How to update A/AAAA record

```
$ curl -d 'host=<Host name>&ip=<IP Address>&key=<API service key>'
```

- Specify request source host IP address if **ip** is not specified
- Recommend to access API Service via HTTPS
