module.exports = {
    book: {
        assets: "./book",
        js: [
          "platform.js",
          "user-widget/user-widget.js",
          "user-widget/angular.min.js",
          "user-widget/app.js"
        ],
        css: [
          "platform.css",
          "user-widget/user-widget.css"
        ],
        html: {
          "head:end": "",
          "body:start": function() {
            return ""
          },
          "body:end": function(){
            return "";
          }
        }
    },
    hooks: {
        init: function() {

        },
        finish: function() {
        }
    }
};
