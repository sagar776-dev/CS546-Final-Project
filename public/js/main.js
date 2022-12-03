(function ($){
    let searchBar = $("#searchbar");
    let searchBtn = $("#searchbtn");
    let errorDiv = $("#error");

    searchBtn.on('click', (event) => {
        try {
            let productList = $("#product-list");
            event.preventDefault();
            let input = searchBar.val().trim();
            //validation
            if(!input) throw "Error: Enter name to search";

            let requestConfig = {
                method: 'POST',
                url: '/products',
                contentType: 'application/json',
                data: JSON.stringify({
                    ProductName: input
                })
            };

            $.ajax(requestConfig).then((responseMessage) => {
                var newElement = $(responseMessage);
                console.log(responseMessage);
                productList.html(newElement.find("#product-list").html());
            });
            errorDiv.hidden = true;
        } catch (error) {
            console.log(error);
            errorDiv.hidden = false;
            $("#error-p").html(error);
        }
    });
})(window.jQuery);