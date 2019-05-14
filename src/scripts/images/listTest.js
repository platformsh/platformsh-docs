/**
 * @file
 * Provides some feature.
 *
 * The extra line between the end of the @file docblock
 * and the file-closure is important.
 */

var json = "/scripts/images/images.json";

function makeList(images, imageType, service, attribute, divName) {

//  makeList(json, "runtimes", "php", "supported");
//  makeList(json, "services", "elasticsearch", "deprecated");

  $.getJSON( images, function( data ) {
    var items = [];
    var current = data[imageType][service][attribute];
    $.each( current, function( key, val ) {
      items.push( "<li id='" + key + "'>" + val + "</li>" );
    });

    $( "<ul/>", {
      "class": attribute + "-list",
      html: items.join( "" )
    }).appendTo( "#" + divName );
  });

}
