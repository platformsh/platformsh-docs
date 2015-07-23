var sectionids = [];
var tre = new RegExp("(<[^<]+)", 'mg');
var cre = new RegExp("<h([0-9])([^<>]+)>[^<]*", 'm');
var hre = new RegExp('id="([^"]+)"');

module.exports = {
  blocks: {
    sections: {
      process: function(block) {
        sectionids = block.args;
        console.log("sectionids: " + sectionids);
        return "";
      }
    }
  },
  hooks: {
    "page:before": function(page) {
      sectionids = [];
      return page;
    },
    "page": function(page) {
      page.sections.forEach(function(section) {
        if (section.type == "normal") {
          var origcontent = section.content;
          var add = true;
          tagchunks = null;
          if (sectionids.length > 0) {
            add = false;
            tagchunks = origcontent.match(tre);
          }
          var depth = 0;
          var content = "";
          if (tagchunks != null && tagchunks.length > 0) {
            tagchunks.forEach(function(chunk) {
              match = cre.exec(chunk);
              if (match != null && match.length > 1) {
                thisdepth = match[1];
                idtag = match[2].trim();
                if (add && thisdepth > depth) {
                  content += chunk;
                } else {
                  ids = hre.exec(idtag);
                  id = '';
                  if (ids != null && ids.length > 0) { id = ids[1]; }
                  if (sectionids.filter(function(i){return i == id}).length > 0) {
                    add = true;
                    depth = thisdepth;
                    content += chunk;
                  } else {
                    depth = 0;
                    add = false;
                  }
                }
              } else {
                if (add) { content += chunk; }
              }
            });
            section.content = content;
          }
        }
      });
      return page;
    }
  }
}
