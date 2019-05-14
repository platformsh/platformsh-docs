/**
 * @file
 * Provides some feature.
 *
 * The extra line between the end of the @file docblock
 * and the file-closure is important.
 */

var json = "/scripts/images/images.json";

function formatTableList(versions, codeStyle) {
		var formattedList;
    if (codeStyle) {
      formattedList = "<code>" + versions.join("</code>, <code>") + "</code>";
    } else {
      formattedList = versions.join(", ");
    }
		return formattedList
}

function makeTable(images, imageType, attribute, divName, codeStyleLists) {
//    makeTable(json, "runtimes", "supported", false);
		var runtimes = [];
    $.getJSON(images, function(data) {
    		var current = data[imageType];
    		$.each(current, function(i, f) {
        		var tblRow = "<tr>" + "<td>" + "<a href=\"" + f.docs + "\">" + f.name + "</a>" + "</td>" +
           "<td>" + "<code>" + f.type + "</code>" + "</td>" +
           "<td>" + formatTableList(f[attribute], codeStyleLists) + "</td>" + "</tr>";
           $(tblRow).appendTo("#" + divName + " tbody");
        });
    });
}
