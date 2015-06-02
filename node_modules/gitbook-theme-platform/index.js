module.exports = {
    book: {
        assets: "./book",
        js: [
            "platform.js"
        ],
        css: [
            "platform.css"
        ],
        html: {
          "head:end": "<link rel='stylesheet' type='text/css' href='//cloud.typography.com/7640312/659566/css/fonts.css'>",
          "body:start": "<div id='platform-bar'><a class='branding' href='/'><span class='logo'></span><span class='site-name'>Docs</span></div></a>"
        }
    },
    hooks: {
        init: function() {
            console.log("init!");
        },
        finish: function() {
            console.log("finish!");
        }
    }
};
