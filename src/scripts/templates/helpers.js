/**
 * @file
 * Provides a few simple functions for pulling in 'Documented' images into the documentation.
 *
 * @var json
 * Reference to 'images.json' file, which lists all documented runtime and service images, which
 * allows for single edit point for image updates, and hopefully future comparisons for flagging
 * 'Undocumented' images in the public docs.
 *
 */
var json = "/scripts/templates/templates.json";

/**
 * Creates an HTML list that can be used to document 'Supported' and 'Deprecated' image
 * versions in language and service pages pulled from 'images.json'. To include use:
 *
 *    <html>
 *      <head>
 *        <script type = "text/javascript" src = "/scripts/images/helpers.js" ></script>
 *      </head>
 *      <body>
 *        <div id = 'mariadbSupported'></div>
 *        <script>
 *          makeList(json, "services", "mysql", "supported", "mariadbSupported");
 *        </script>
 *      </body>
 *    </html>
 *
 *
 * @param obj images Calls the json object read from 'images.json'.
 * @param str imageType Dictates whether list will be made for and image from "runtimes" or "services".
 * @param str childImage The individual image the list is made from (i.e., "php", "nodejs", "mongodb", "varnish").
 * @param str attribute Which attribute of that image JSON (containing a list) will be listed (i.e. "supported").
 * @param str divName References the id of <div> in the Markdown document.
 *
 */
function makeList(images, imageType, childImage, attribute, divName) {

  $.getJSON( images, function( data ) {
    var items = [];
    var current = data[imageType][childImage][attribute];
    $.each( current, function( key, val ) {
      items.push( "<li id='" + key + "'>" + val + "</li>" );
    });

    $( "<ul/>", {
      "class": attribute + "-list",
      html: items.join( "" )
    }).appendTo( "#" + divName );
  });

}

/**
 * Provides the ability within a table to format a list within 'images.json' either as unformatted text joined
 * by spaces or formatted so that each element is given the '<code></code>' tags.
 *
 * @param list unformatted The unformatted list input.
 * @param bool codeStyle Whether <code> flags should be placed on list elements.
 *
 */
function formatTableList(unformatted, codeStyle) {
		var formattedList;
    if (codeStyle) {
      formattedList = "<code>" + unformatted.join("</code>, <code>") + "</code>";
    } else {
      formattedList = unformatted.join(", ");
    }
		return formattedList
}

/**
 * Creates an HTML list that can be used to document 'Supported' and 'Deprecated' image
 * versions in language and service pages pulled from 'images.json'. To include use:
 *
 *    <html>
 *      <head>
 *        <script type = "text/javascript" src = "/scripts/images/helpers.js" ></script>
 *      </head>
 *        <body>
 *           <div class="wrapper">
 *           <div class="profile">
 *             <table id= "serviceTable" border="1">
 *             <thead>
 *             <th>Service</th>
 *             <th><code>type</code></th>
 *             <th>Supported <code>version</code></th>
 *             </thead>
 *               <tbody>
 *               </tbody>
 *              </table>
 *           </div>
 *           </div>
 *        </body>
 *        <script>
 *          makeTable(json, "services", "supported", "serviceTable", false);
 *        </script>
 *        </body>
 *     </html>
 *
 *
 * @param obj images Calls the json object read from 'images.json'.
 * @param str imageType Dictates whether list will be made for and image from "runtimes" or "services".
 * @param str attribute Which attribute of that image JSON (containing a list) will be listed (i.e. "supported").
 * @param str divName References the id of <div> in the Markdown document.
 * @param bool codeStyleLists Whether <code> flags should be placed on list elements.
 *
 */
function makeTable(images, language, divName) {
		var runtimes = [];
    $.getJSON(images, function(data) {
    		var templateTypes = data[language];
    		$.each(templateTypes, function(i, f) {
    		    var templates = data[language][f]
    		    $.each(templates, function(i, t) {
                var tblRow = "<tr>" + "<td>" + "somthing" + "</td>" +
               "<td>" + "<a href=\"" + "something" + "\">" + "something" + "</a>" + "</td>" +
               "<td>" + "services" + "</td>" + "<td>" + "status" + "</td>" +"</tr>";
               $(tblRow).appendTo("#" + divName + " tbody");
           });
        });
    });
}
