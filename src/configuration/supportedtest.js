$.getJSON('/configuration/test.json', function(response){
    console.log(data)
    $('#storeList').append('<ul/>')
    $.each(data.storeList.state, function() {
        var list = $('#storeList ul'),
            listItem = $('<li/>'),
            html = listItem.append($('<h3/>').text(this.stateName));

        $.each(this.store, function() {
            listItem.append($('<a />').attr('href', this.storeURL).text(this.storeName));
        });

        list.append(html)

});
