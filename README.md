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
