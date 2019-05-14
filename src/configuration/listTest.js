var cwData = {
    "product": [
        {
            "category": "Product 1",
            "items": [
                {
                    "name": "Item 1.1"
                },
                {
                    "name": "Item 1.2"
                }
            ]
        },
        {
            "category": "Product 2",
            "items": [
                {
                    "name": "Item 2"
                }
            ]
        },
        {
            "category": "Product 3",
            "items": [
                {
                    "name": "Item 3"
                }
            ]
        }
    ]
};

$.each(cwData.product, function (i, product) {
            var option_cate = '<li class="item"><a href="#">' + product.category + '</a></li>';
            // Add the product names
            var details = '<ul class="details">';
            $.each(product.items, function (i, item) {
                details += '<li class="name"><a href="#">' + item.name + '</a></li>';
            });

    details += '</ul>';

    $(option_cate).appendTo('#product_list').append(details);
        });
