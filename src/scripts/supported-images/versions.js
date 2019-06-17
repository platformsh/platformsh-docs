/**
 * Creates an HTML list that can be used to document 'Supported' and 'Deprecated' image
 * versions in language and service pages pulled from 'images.json'. To include use:
 *
 * To list the supported versions of the service InfluxDB:
 *
 * <div id = "influxdbSupported"></div>
 *
 * <script>
 * makeImagesList("services", "influxdb", "supported", "influxdbSupported");
 * </script>
 *
 * @param str imageType Dictates whether list will be made for and image from "runtimes" or "services".
 * @param str childImage The individual image the list is made from (i.e., "php", "nodejs", "mongodb", "varnish").
 * @param str attribute Which attribute of that image JSON (containing a list) will be listed ("supported", "deprecated").
 * @param str divName References the id of <div> in the Markdown document.
 *
 */
function makeImagesList(imageType, childImage, attribute, divName) {

  var jsonSource = "/scripts/supported-images/versions.json";

  $.getJSON(jsonSource, function( data ) {
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
function formatImagesTableList(unformatted, codeStyle) {
		var formattedList;
    if (codeStyle) {
      formattedList = "<code>" + unformatted.join("</code>, <code>") + "</code>";
    } else {
      formattedList = unformatted.join(", ");
    }
		return formattedList;
}


function makeImagesTableHeader(imageType, tableName) {

		  var table = document.getElementById(tableName);
      var header = table.createTHead();
      var row = header.insertRow(0);

      var cell = row.insertCell(0);
      var cell2 = row.insertCell(1);
      var cell3 = row.insertCell(2);

      if (imageType == "runtimes") {

          cell.innerHTML = "<b>Language</b>";
          cell2.innerHTML = "<b><code>runtime</code></b>";
          cell3.innerHTML = "<b>Supported <code>version</code></b>";

      } else if (imageType == "services") {

          cell.innerHTML = "<b>Service</b>";
          cell2.innerHTML = "<b><code>type</code></b>";
          cell3.innerHTML = "<b>Supported <code>version</code><b>";

      }
}

/**
 * Creates an table that can be used to document 'Supported' image versions in language
 * and service pages pulled from 'images.json'. To include use:
 *
 * <div id = "table">
 * <table id="runtimeTable" border="1">
 * <tbody></tbody>
 * </table>
 * </div>
 *
 * <script>
 * makeImagesTable("runtimes", "supported", "runtimeTable");
 * </script>
 *
 * @param str imageType Dictates whether list will be made for and image from "runtimes" or "services".
 * @param str attribute Which attribute of that image JSON (containing a list) will be listed (i.e. "supported").
 * @param str divName References the id of <div> in the Markdown document.
 * @param bool codeStyleLists Whether <code> flags should be placed on list elements.
 *
 */
function makeImagesTable(imageType, attribute, tableName, codeStyleLists=false) {

    var jsonSource = "/scripts/supported-images/versions.json";

    makeImagesTableHeader(imageType, tableName);

    $.getJSON(jsonSource, function(data) {
    		var current = data[imageType];
        $.each(current, function(i, f) {
        		var tblRow = "<tr>" + "<td>" + "<a href=\"" + f.docs + "\">" + f.name + "</a>" + "</td>" +
               "<td>" + "<code>" + f.type + "</code>" + "</td>" +
               "<td>" + formatImagesTableList(f[attribute], codeStyleLists) + "</td>" + "</tr>";
               $(tblRow).appendTo("#" + tableName + " tbody");
        });
    });
}


function makeNewestAppYaml(imageName, divName) {
	var imageType = 'runtimes';
  var jsonSource = "/scripts/supported-images/versions.json";
  $.getJSON(jsonSource, function( data ) {
		var currentType = data[imageType][imageName].type;
    var supportedVersions = data[imageType][imageName].supported;
    var mostRecent = supportedVersions[supportedVersions.length - 1];

    var div = document.getElementById(divName);
  	var details = "<pre><code class='lang-yaml'><span class='hljs-attr'>type:</span> <span class='hljs-string'>&apos;" + currentType + ":" + mostRecent + "&apos;</span></code></pre>";

  	div.innerHTML += details;
  });
}

function makeNewestServicesYaml(imageName, serviceName, divName, usesDisk=false) {
   var imageType = 'services';
   var defaultDisk = 1024;
   var jsonSource = "/scripts/supported-images/versions.json";
   $.getJSON(jsonSource, function( data ) {
  		 var currentType = data[imageType][imageName].type;
       var supportedVersions = data[imageType][imageName].supported;
       var mostRecent = supportedVersions[supportedVersions.length - 1];

       var div = document.getElementById(divName);

       var details = "<pre><code class='lang-yaml'><span class='hljs-attr'>" + serviceName + ":</span>\n";
       details += "<span class='hljs-attr'>    type:</span> " + currentType + ":<span class='hljs-number'>" + mostRecent + "</span>\n";

       if (usesDisk) {
          details += "<span class='hljs-attr'>    disk:</span> <span class='hljs-number'>" + defaultDisk + "</span>\n";
       }

       details += "</code></pre>";

   	div.innerHTML += details;
   });
}
