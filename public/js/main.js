// let searchBar = document.getElementById("searchbar");
// let searchBtn = document.getElementById("searchbtn");
// let errorDiv = document.getElementById("error");

// let searchedDevices = [];

// if(searchBtn){
//     searchBtn.addEventListener('click', (event) => {
//         try {
//             event.preventDefault();
//             //TODO: Validate the Input using Validation functions
//             let input = searchBar.value.trim();
//             if(!input) throw "Error: Invalid Input";
            
//             //TODO: After Validation route the event to getProductByName route

//             //Keeping track of no.of hits on a product
            
//             if(!searchedDevices.find(device => device.name==input)){
//                 searchedDevices.push({
//                     name: input,
//                     hit: 1
//                 });
//             }
//             else{
//                 searchedDevices.find(device => device.name==input).hit++;
//             }
//             errorDiv.hidden = true;
//         } catch (error) {
//             errorDiv.hidden = false;
//             errorDiv.innerHTML = error;
//         }
//     });
// }

(function ($){
    let searchBar = $("#searchbar");
    let searchBtn = $("#searchbtn");
    let errorDiv = $("#error");
    let searchResult = $("#search-result");

    searchBtn.on('click', (event) => {
        try {
            event.preventDefault();
            let input = searchBar.val().trim();
            //validation

            let requestConfig = {
                method: 'POST',
                url: '/products',
                contentType: 'application/json',
                data: JSON.stringify({
                    productName: input
                })
            };

            $.ajax(requestConfig).then((responseMessage) => {
                console.log(responseMessage);
            });
        } catch (error) {
            console.log(error);
        }
    });
})(window.jQuery);