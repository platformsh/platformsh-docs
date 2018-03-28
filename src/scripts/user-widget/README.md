# User widget

## Install
```html
<link rel="stylesheet" href="./user-widget.css">
<script type="text/javascript" src="./user-widget.min.js"></script>
You can use it as a regular script or use npm install
```

## Use
```javascript
  userWidget.init(documentNode, options);
```
### Options
- `accountUrl`: the account url, default "https://accounts.platform.sh"

- `source`: the name of the app the user widget is used currently, default: "account"

- `getQueryString`: a function that return the queryString you want to pass to the context api call, default: path => path

- `showProjectsMenu`: do the user widget show the current user projects menu, default: true

- `includeBilling`: do the user widget show the billing link, default: true

- `includeSupport`: do the user widget show the support link, default: true

- `activateTalkus`: activate talkus, default: false

## Dev
The dev environment contains an html page to test the user widget.

To run it:
```javascript
  npm install
  npm start
```
