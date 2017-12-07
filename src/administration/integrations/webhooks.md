# Generic Webhook

This hook will allow you to capture any push events on platform and POST
a JSON file describing the activity to the url of your choice. You can
use this to further automate your Platform.sh workflow. 

For example the `routes` object keys will give you urls against which you can 
launch automated user testing.

```bash
$ platform integration:add --type=webhook --url=A-URL-THAT-CAN-RECEIVE-THE-POSTED-JSON
```

Here you can see an example of the response:

```javascript
{
  "id": "774-this-is-an-example-valuexzs4no",
  "_links": {
    "self": {
      "href": "https://eu.platform.sh/api/projects/sx-this-is-an-example-value-hu/activities/774-this-is-an-example-valuexzs4no",
      "meta": {
        "get": {
          "responses": {
            "default": {
              "schema": {
                "properties": {
                  "created_at": {
                    "type": "string",
                    "format": "date-time"
                  },
                  "updated_at": {
                    "type": "string",
                    "format": "date-time"
                  },
                  "type": {
                    "type": "string"
                  },
                  "parameters": {
                    "properties": {
                    },
                    "required": [

                    ]
                  },
                  "project": {
                    "type": "string"
                  },
                  "environments": {
                    "items": {
                      "type": "string"
                    },
                    "type": "array"
                  },
                  "state": {
                    "type": "string"
                  },
                  "result": {
                    "type": "string"
                  },
                  "started_at": {
                    "type": "string",
                    "format": "date-time"
                  },
                  "completed_at": {
                    "type": "string",
                    "format": "date-time"
                  },
                  "completion_percent": {
                    "type": "integer"
                  },
                  "log": {
                    "type": "string"
                  },
                  "payload": {
                    "properties": {
                    },
                    "required": [

                    ]
                  }
                },
                "required": [
                  "created_at",
                  "updated_at",
                  "type",
                  "parameters",
                  "project",
                  "environments",
                  "state",
                  "result",
                  "started_at",
                  "completed_at",
                  "completion_percent",
                  "log",
                  "payload"
                ]
              }
            }
          },
          "parameters": [

          ]
        }
      }
    }
  },
  "created_at": "2017-12-07T10:45:30.870660+00:00",
  "updated_at": "2017-12-07T10:47:39.369761+00:00",
  "type": "environment.push",
  "parameters": {
    "environment": "master",
    "old_commit": "34be31cbabcc0f65d7fd8ec29769947396d0cabd",
    "new_commit": "8d2e6003d50136c750fb8b65ec506ee3aa4a5b15",
    "user": "384491da-031e-4c23-b264-9f96040a6e36"
  },
  "project": "sx-this-is-an-example-value-hu",
  "environments": [
    "master"
  ],
  "state": "complete",
  "result": "success",
  "started_at": "2017-12-07T10:45:30.996898+00:00",
  "completed_at": "2017-12-07T10:47:39.369741+00:00",
  "completion_percent": 100,
  "log": "Found 1 new commit.\n\nBuilding application 'myrubyapp' (runtime type: ruby:2.4-rc, tree: 2d24228)\n  Generating runtime configuration.\n  \n  Executing build hook...\n    2.4.2\n    Fetching gem metadata from https://rubygems.org/..........\n    Resolving dependencies...\n    Installing concurrent-ruby 1.0.5\n    Installing i18n 0.9.1\n    Installing minitest 5.10.3\n    Installing thread_safe 0.3.6\n   ...more lines...\n   Installing unicorn 5.3.1\n    Using bundler 1.7.4\n    Your bundle is complete!\n    Use `bundle show [gemname]` to see where a bundled gem is installed.\n  \n  Executing pre-flight checks...\n\n  Compressing application.\n  Beaming package to its final destination.\n\nProvisioning certificates:\n  Reusing existing certificates.\n\n\nRe-deploying environment sx-this-is-an-example-value-hu-master-7rqtwti.\n  Environment configuration:\n    myrubyapp (type: ruby:2.4-rc, size: S, disk: 2048)\n    postgresql (type: postgresql:9.3, size: S, disk: 256)\n    mongodb (type: mongodb:3.0, size: S, disk: 500)\n    redis (type: redis:3.2-rc, size: S)\n    influxdb (type: influxdb:1.2, size: S, disk: 256)\n    elasticsearch (type: elasticsearch, size: S, disk: 256)\n    rabbitmq (type: rabbitmq:3.5, size: S, disk: 256)\n    mysql (type: mysql:10.0, size: S, disk: 256)\n    solr (type: solr:4.10, size: S, disk: 256)\n\n  Environment routes:\n    http://master-7rqtwti-sx-this-is-an-example-value-hu.eu.platform.sh/ redirects to https://master-7rqtwti-sx-this-is-an-example-value-hu.eu.platform.sh/\n    https://master-7rqtwti-sx-this-is-an-example-value-hu.eu.platform.sh/ is served by application `myrubyapp`\n\n",
  "payload": {
    "environment": {
      "status": "active",
      "head_commit": "8d2e6003d50136c750fb8b65ec506ee3aa4a5b15",
      "machine_name": "master-7rqtwti",
      "name": "master",
      "parent": null,
      "title": "Master",
      "created_at": "2017-11-22T14:43:17.154870+00:00",
      "updated_at": "2017-11-22T14:43:17.155103+00:00",
      "clone_parent_on_create": true,
      "project": "sx-this-is-an-example-value-hu",
      "is_dirty": false,
      "restrict_robots": true,
      "has_code": true,
      "enable_smtp": true,
      "id": "master",
      "deployment_target": "local",
      "http_access": {
        "is_enabled": true,
        "addresses": [

        ],
        "basic_auth": {
        }
      },
      "is_main": true
    },
    "commits": [
      {
        "sha": "8d2e6003d50136c750fb8b65ec506ee3aa4a5b15",
        "message": "deploy with release candidates",
        "parents": [
          "34be31cbabcc0f65d7fd8ec29769947396d0cabd"
        ],
        "author": {
          "email": "ori@example.com",
          "name": "Ori Pekelman"
        }
      }
    ],
    "commits_count": 1,
    "user": {
      "created_at": "2017-12-07T10:45:13.491553+00:00",
      "display_name": "Ori Pekelman",
      "id": "384491da-031e-4c23-b264-9f96040a6e36",
      "updated_at": null
    },
    "deployment": {
      "id": "current",
      "services": {
        "mongodb": {
          "type": "mongodb:3.0",
          "size": "AUTO",
          "disk": 500,
          "access": {
          },
          "configuration": {
          },
          "relationships": {
          }
        },
        "redis": {
          "type": "redis:3.2-rc",
          "size": "AUTO",
          "disk": null,
          "access": {
          },
          "configuration": {
          },
          "relationships": {
          }
        },
        "solr": {
          "type": "solr:4.10",
          "size": "AUTO",
          "disk": 256,
          "access": {
          },
          "configuration": {
          },
          "relationships": {
          }
        }
      },
      "routes": {
        "https://master-7rqtwti-sx-this-is-an-example-value-hu.eu.platform.sh/": {
          "type": "upstream",
          "redirects": {
            "expires": "-1s",
            "paths": {
            }
          },
          "original_url": "https://{default}/",
          "cache": {
            "enabled": true,
            "default_ttl": 0,
            "cookies": [
              "*"
            ],
            "headers": [
              "Accept",
              "Accept-Language"
            ]
          },
          "ssi": {
            "enabled": false
          },
          "upstream": "myrubyapp"
        },
        "http://master-7rqtwti-sx-this-is-an-example-value-hu.eu.platform.sh/": {
          "type": "redirect",
          "redirects": {
            "expires": "-1s",
            "paths": {
            }
          },
          "original_url": "http://{default}/",
          "to": "https://master-7rqtwti-sx-this-is-an-example-value-hu.eu.platform.sh/"
        }
      },
      "webapps": {
        "myrubyapp": {
          "size": "AUTO",
          "disk": 2048,
          "access": {
            "ssh": "contributor"
          },
          "relationships": {
            "mongodb": "mongodb:mongodb",
            "redis": "redis:redis",
            "solr": "solr:solr"
          },
          "mounts": {
            "/public": "shared:files/files"
          },
          "timezone": null,
          "variables": {
          },
          "name": "myrubyapp",
          "type": "ruby:2.4-rc",
          "runtime": {
          },
          "preflight": {
            "enabled": true,
            "ignored_rules": [

            ]
          },
          "web": {
            "locations": {
              "/": {
                "root": "public",
                "expires": "1h",
                "passthru": true,
                "scripts": true,
                "allow": true,
                "headers": {
                },
                "rules": {
                }
              }
            },
            "commands": {
              "start": "unicorn -l $SOCKET -E production config.ru",
              "stop": null
            },
            "upstream": {
              "socket_family": "unix",
              "protocol": null
            },
            "move_to_root": false
          },
          "hooks": {
            "build": "ruby -e 'bundle install\n",
            "deploy": null
          }
        }
      },
      "workers": {
      }
    }
  }
}
```
