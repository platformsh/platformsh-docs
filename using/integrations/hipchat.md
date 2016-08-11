# HipChat

The [HipChat](https://hipchat.com) integration allows you to send
notifications about your Platform.sh activity directly to HipChat.

To enable the HipChat webhook with the CLI:

```bash
$ platform integration:add --type=hipchat --room=ROOM-ID --token=HIPCHAT-TOKEN
```

The two optional parameters control what events and states you want to
track:

-   `events`: ["*"]
-   `states`: ["pending", "in_progress", "complete"]
