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
          "body:start": function() {
            return "<div id='platform-bar'><a class='branding' href='/'><span class='logo'></span><span class='site-name'>Docs</span></a><div class='navlink'><span>/</span>"+this.options.title+"</div></div>"
          }
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
