var path = require('path');

module.exports = {
    book: {
        assets: "./book",
        js: ["plugin.js"],
        css: ["plugin.css"]
    },
    hooks: {
        // After html generation
        "page": function(page) {
            if(this.config.options.generator !== 'website') {
                return page;
            }

            var config = this.options.pluginsConfig["edit-link"] || {};

            if (!config.base) {
                throw "ERROR: 'base' value required to generate 'Edit This Page' link. \nFor help, please refer to - https://github.com/rtCamp/gitbook-plugin-edit-link/blob/master/README.md#usage";
            }

            var label = (config.label && config.label[this.context.config.language]) || config.label || "Edit This Page";

            // add  slash at the end if not present
            var base = config.base;
            if(base.slice(-1) != "/") {
                base = base + "/";
            }

            // relative path to the page
            var newPath = path.relative(this.root, page.rawPath);

            // language, if configured
            var lang = "";
            if(this.context.config.language) {
                lang = this.context.config.language + "/";
            }

            rtEditLink = '<a id="edit-link" href="' + base + lang + newPath + '" class="btn fa fa-edit pull-left">&nbsp;&nbsp;' + label + '</a>';

            page.sections
                .filter(function(section) {
                    return section.type == 'normal';
                })
                .forEach(function(section) {
                    section.content = rtEditLink + section.content;
                });

            return page;
        }
    }
};
