let searchBar = document.getElementById("searchbar");
let searchBtn = document.getElementById("searchbtn");
let errorDiv = document.getElementById("error");

let searchedDevices = [];

if(searchBtn){
    searchBtn.addEventListener('click', (event) => {
        try {
            event.preventDefault();
            //TODO: Validate the Input using Validation functions
            let input = searchBar.value.trim();
            if(!input) throw "Error: Invalid Input";
            
            //TODO: After Validation route the event to getProductByName route

            //Keeping track of no.of hits on a product
            
            if(!searchedDevices.find(device => device.name==input)){
                searchedDevices.push({
                    name: input,
                    hit: 1
                });
            }
            else{
                searchedDevices.find(device => device.name==input).hit++;
            }
            errorDiv.hidden = true;
        } catch (error) {
            errorDiv.hidden = false;
            errorDiv.innerHTML = error;
        }
    });
}