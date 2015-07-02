# Generic hook

This hook will allow you to capture any push events on platform and POST
a JSON file describing the activity to the url of your choice. You can
use this to further automate your Platform.sh workflow.

```bash
$ platform integration:add --type=webhook --url=A-URL-THAT-CAN-RECEIVE-THE-POSTED-JSON
```

Here you can see an example of the response:

```javascript
{
"completed_at": "2015-02-01T16:57:07.347350+00:00",
"completion_percent": 100,
"created_at": "2015-02-01T16:57:06.799016+00:00",
"environments": [
    "master"
],
"id": "o6nnkdf4w7jdm",
"log": "Found 1 new commit.\n\nBuilding application ...",
"parameters": {
    "environment": "master",
    "new_commit": "b52500ed5419ce15403963cd1f9203d7a230de86",
    "old_commit": "8008b0cf4535adee78a7b4b7c5d23f6cac251c2b",
    "user": "35a491da-031e-4c23-b264-9f96040a6e36"
},
"payload": {
    "commits": [
        {
            "author": {
                "email": "user@example.com",
                "name": "John Doe"
            },
            "message": "empty",
            "sha": "35a500ed5419ce15403963cd1f9203d7a230de86"
        }
    ],
    "commits_count": 1,
    "environment": {
        "created_at": "2015-01-21T12:43:15.331095+00:00",
        "deployment_target": "local",
        "enable_smtp": true,
        "has_code": true,
        "head_commit": "35a500ed5419ce15403963cd1f9203d7a230de86",
        "http_access": {
            "addresses": [],
            "basic_auth": {}
        },
        "id": "master",
        "is_dirty": false,
        "is_main": true,
        "name": "master",
        "parent": null,
        "project": "7polx4hc6wak6",
        "status": "active",
        "title": "Master",
        "updated_at": "2015-01-21T12:43:15.331240+00:00"
    },
    "user": {
        "created_at": "2015-02-01T16:56:21.692740+00:00",
        "display_name": "John Doe",
        "id": "35a491da-031e-4c23-b264-9f96040a6e36",
        "updated_at": null
    }
},
"project": "7polx4hc6wak6",
"result": "success",
"started_at": "2015-02-01T16:57:06.834660+00:00",
"state": "complete",
"type": "environment.push",
"updated_at": "2015-02-01T16:57:07.347358+00:00"
}
```
