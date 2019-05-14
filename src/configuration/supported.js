var object = {
  "services": {
    "elasticsearch": {
      "name": "Elasticsearch",
      "type": "elasticsearch",
      "supported": [
        "5.2",
        "5.4",
        "6.5"
      ],
      "deprecated": [
        "0.90",
        "1.4",
        "1.7",
        "2.4"
      ],
      "docs": "\/configuration\/services\/elasticsearch.html"
    }
  }
};


$('#storeList').append('<ul/>')
$.each(object.services.elasticsearch, function() {
    var list = $('#storeList ul'),
        listItem = $('<li/>'),
        html = listItem;

    $.each(this.supported, function() {
        listItem.append($('<a />').text("something"));
    });

});
