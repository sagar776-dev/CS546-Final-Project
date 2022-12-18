(function ($){
    var form = $("#product-add-form");
        nameInput = $("#name");
        manufacturerInput = $("#manufacturer");
        startDateInput = $("#startDate");
        priceInput = $("#price");
        urlInput = $("#url");
        descriptionInput = $("#description");
        categoryInput = $("#category");
        picturesInput = $("#pictures");
        errorLi = $("#errorlist");
        errorDiv = $("#errorDiv");
        

    let errorList = [];
    let pictureUrl = [];

    //Validation Utilities
    function isValidURL(url){
        try {
            var givenUrl = new URL(url);
        } catch (error) {
            console.log(error);
            return false;
        }
        return true;
    }

    function alphabetsStringValidation(input, value){
        if(!value){
            errorList.push(`${input} should not be empty`);
        }
        else{
            value = value.trim();
            if(value.length < 1)
                errorList.push(`${input} should not be empty`);
            else if(value.length < 2)
                errorList.push(`${input} should be at least 2 characters long`);
        }
        return value;
    }

    function alphanumericStringValidation(input, value){
        if(!value){
            errorList.push(`${input} should not be empty`);
        }
        else{
            value = value.trim();
            if(value.length < 1)
                errorList.push(`${input} should not be empty`);
            else if(value.length < 2)
                errorList.push(`${input} should be at least 2 characters long`);
        }
        return value;
    }


    function validateReleaseDate(date){
        if (!date){errorList.push('You must provide a release date for your Product');}
        else{
            if (typeof date !== 'string')
                errorList.push('runtime must be a string');
            else if (date.trim().length === 0)
                errorList.push ('date cannot be an empty string or string with just spaces');
        }
        return date.trim();
    }

    function inputValidation(product){
        if(!product.name)
            errorList.push("Product Name should not be empty");
        else{
            product.name = product.name.trim();
            if(product.name.length < 1)
                errorList.push("Product name should not be empty");
            else if(product.name.length < 6)
                errorList.push("Product Name should have atleast 6 characters");
        }

        if(!product.manufacturer){
            errorList.push("Manufacturer should not be empty");
        }
        else{
            product.manufacturer = product.manufacturer.trim();
            if(product.manufacturer.length < 1)
                errorList.push("Manufacturer should not be empty");
            else if(product.manufacturer.length < 2)
                errorList.push("Manufacturer should be at least 2 characters long");
        }

        product.startDate = validateReleaseDate(product.startDate);

        if(!product.price){
            errorList.push("Price should not be empty");
        }
        else{
            product.price = product.price.trim();
            if(product.price.length < 1)
                errorList.push("Price should not be empty");
            else if(isNaN(product.price))
                errorList.push("Price should be a number");
            else if(product.price <= 0)
                errorList.push("Price must be greater than Zero");
            product.price = parseFloat(product.price);
        }

        if(!product.url){
            errorList.push("URL should not be empty");
        }
        else{
            product.url = product.url.trim();
            if(product.url.length < 1)
                errorList.push("URL should not be empty");
            else if(!isValidURL(product.url))
                errorList.push("Invalid URL for the Product");
        }

        if(!product.Description){
            errorList.push("Description should not be empty");
        }
        else{
            product.Description = product.Description.trim();
            if(product.Description.length < 1)
                errorList.push("Description should not be empty");
            else if(product.Description.length < 5)
                errorList.push("Description should be at least 5 characters long");
        }

        if(!product.category){
            errorList.push("Must select one of the three categories");
        }
        
        if(product.pictures.length < 1){
            errorList.push("At least one picture must be uploaded");
        }

        if(product.details.length < 1){
            errorList.push("Must enter specification details");
        }
        else{
            product.details.find(element=>element.name==="Screen Size").value = alphanumericStringValidation("Screen Size", (product.details.find(element=>element.name==="Screen Size")||emptyDetailsObj).value);
            product.details.find(element=>element.name==="Processor Model").value = alphanumericStringValidation("Processor Model", (product.details.find(element=>element.name==="Processor Model")||emptyDetailsObj).value);
            product.details.find(element=>element.name==="Screen Resolution").value= alphanumericStringValidation("Screen Resolution", (product.details.find(element=>element.name==="Screen Resolution")||emptyDetailsObj).value);
            product.details.find(element=>element.name==="Operating System").value = alphanumericStringValidation("Operating System", (product.details.find(element=>element.name==="Operating System")||emptyDetailsObj).value);
            product.details.find(element=>element.name==="Color").value = alphanumericStringValidation("Color", (product.details.find(element=>element.name==="Color")||emptyDetailsObj).value);
            if(product.category==="laptops"){
                product.details.find(element=>element.name==="System Memory (RAM)").value = alphanumericStringValidation("System Memory (RAM)", (product.details.find(element=>element.name==="System Memory (RAM)")||emptyDetailsObj).value);
                product.details.find(element=>element.name==="Graphics").value = alphanumericStringValidation("Graphics", (product.details.find(element=>element.name==="Graphics")||emptyDetailsObj).value);
                product.details.find(element=>element.name==="Storage Type").value = alphanumericStringValidation("Storage Type", (product.details.find(element=>element.name==="Storage Type")||emptyDetailsObj).value);
                product.details.find(element=>element.name==="Total Storage Capacity").value = alphanumericStringValidation("Total Storage Capacity", (product.details.find(element=>element.name==="Total Storage Capacity")||emptyDetailsObj).value);
                product.details.find(element=>element.name==="Touch Screen").value = alphanumericStringValidation("Touch Screen", (product.details.find(element=>element.name==="Touch Screen")||emptyDetailsObj).value);
                product.details.find(element=>element.name==="Processor Model Number").value = alphanumericStringValidation("Processor Model Number", (product.details.find(element=>element.name==="Processor Model Number")||emptyDetailsObj).value);
                product.details.find(element=>element.name==="Battery Type").value = alphanumericStringValidation("Battery Type", (product.details.find(element=>element.name==="Battery Type")||emptyDetailsObj).value);
                product.details.find(element=>element.name==="Backlit Keyboard").value = alphabetsStringValidation("Backlit Keyboard", (product.details.find(element=>element.name==="Backlit Keyboard")||emptyDetailsObj).value);
                product.details.find(element=>element.name==="Brand").value = alphanumericStringValidation("Brand", (product.details.find(element=>element.name==="Brand")||emptyDetailsObj).value);
                product.details.find(element=>element.name==="Model Number").value = alphanumericStringValidation("Model Number", (product.details.find(element=>element.name==="Model Number")||emptyDetailsObj).value);
            }
            else if(product.category==="tablets"){
                product.details.find(element=>element.name==="Carrier").value = alphabetsStringValidation("Carrier", (product.details.find(element=>element.name==="Carrier")||emptyDetailsObj).value);
                product.details.find(element=>element.name==="Wireless Technology").value = alphanumericStringValidation("Wireless Technology", (product.details.find(element=>element.name==="Wireless Technology")||emptyDetailsObj).value);
                product.details.find(element=>element.name==="Voice Assistant Built-in").value = alphabetsStringValidation("Voice Assistant Built-in", (product.details.find(element=>element.name==="Voice Assistant Built-in")||emptyDetailsObj).value);
                product.details.find(element=>element.name==="Brand").value = alphabetsStringValidation("Brand", (product.details.find(element=>element.name==="Brand")||emptyDetailsObj).value);
                product.details.find(element=>element.name==="Bluetooth Enabled").value = alphabetsStringValidation("Bluetooth Enabled", (product.details.find(element=>element.name==="Bluetooth Enabled")||emptyDetailsObj).value);
                product.details.find(element=>element.name==="Keyboard Type").value = alphabetsStringValidation("Keyboard Type", (product.details.find(element=>element.name==="Keyboard Type")||emptyDetailsObj).value);
                product.details.find(element=>element.name==="Wireless Compatibility").value = alphabetsStringValidation("Wireless Compatibility", (product.details.find(element=>element.name==="Wireless Compatibility")||emptyDetailsObj).value);
            }
            else if(product.category==="phones"){
                product.details.find(element=>element.name==="Total Storage Capacity").value = alphanumericStringValidation("Total Storage Capacity", (product.details.find(element=>element.name==="Total Storage Capacity")||emptyDetailsObj).value);
                product.details.find(element=>element.name==="System Memory (RAM)").value = alphanumericStringValidation("System Memory (RAM)", (product.details.find(element=>element.name==="System Memory (RAM)")||emptyDetailsObj).value);
                product.details.find(element=>element.name==="System Memory (RAM)").value = alphanumericStringValidation("Wireless Connectivity", (product.details.find(element=>element.name==="Wireless Connectivity")||emptyDetailsObj).value);
                product.details.find(element=>element.name==="Battery Type").value = alphanumericStringValidation("Battery Type", (product.details.find(element=>element.name==="Battery Type")||emptyDetailsObj).value);
                
            }
        }
        return product;
    }


    categoryInput.change(function(){
        if(categoryInput.val()==="laptops"){
            $(".add-product .product-add-form .spec-div-phones").hide();
            $(".add-product .product-add-form .spec-div-tablets").hide();
            $(".add-product .product-add-form .spec-div-laptops").show();
        }
        else if(categoryInput.val()==="phones"){
            $(".add-product .product-add-form .spec-div-laptops").hide();
            $(".add-product .product-add-form .spec-div-tablets").hide();
            $(".add-product .product-add-form .spec-div-phones").show();
        }
        else if(categoryInput.val()==="tablets"){
            $(".add-product .product-add-form .spec-div-phones").hide();
            $(".add-product .product-add-form .spec-div-laptops").hide();
            $(".add-product .product-add-form .spec-div-tablets").show();
        }
    });

    // picturesInput.change(function(){
    //     if(this.files){
    //         const reader = new FileReader();

    //         reader.addEventListener("load",()=>{
    //             pictureUrl.push(reader.result);
    //         });
    //         reader.readAsDataURL(this.files[0]);
    //     }
    // });


    form.submit(function (event){
        event.preventDefault();
        errorList = [];
        errorDiv.addClass("hidden");
        errorLi.empty();

        pictureUrl.push(picturesInput.val());

        let product = {
            name: nameInput.val(),
            manufacturer: manufacturerInput.val(),
            startDate: startDateInput.val(),
            price: priceInput.val(),
            url: urlInput.val(),
            Description: descriptionInput.val(),
            category: categoryInput.val(),
            pictures: pictureUrl,
            details: [],
            reviews: [],
            visitedTimes: 0,
            comments: [],
            QandA: []
        };

        product.details.push({
            name: "Screen Size",
            value: $("#screenSize").val()
        });
        product.details.push({
            name: "Processor Model",
            value: $("#processorModel").val()
        });
        product.details.push({
            name:"Screen Resolution",
            value: $("#screenRes").val()
        });
        product.details.push({
            name: "Operating System",
            value: $("#operatingSystem").val()
        });
        product.details.push({
            name: "Color",
            value: $("#color").val()
        });

        if(product.category === "laptops"){
            product.details.push({
                name: "System Memory (RAM)",
                value: $("#ram-laptops").val()
            });
            product.details.push({
                name: "Graphics",
                value: $("#graphics").val()
            });
            product.details.push({
                name: "Storage Type",
                value: $("#storageType").val()
            });
            product.details.push({
                name: "Total Storage Capacity",
                value: $("#laptopStorage").val()
            });
            product.details.push({
                name: "Touch Screen",
                value: $('[name="touchScreen"]').val(),
            });
            product.details.push({
                name: "Processor Model Number",
                value: $("#processorModelNo").val()
            });
            product.details.push({
                name: "Battery Type",
                value: $("#laptopBatteryType").val()
            });
            product.details.push({
                name: "Backlit Keyboard",
                value: $('[name="backlitKeyboard"]').val()
            });
            product.details.push({
                name: "Brand",
                value: $("#laptop-brand").val()
            });
            product.details.push({
                name: "Model Number",
                value: $("#modelNumber").val()
            });
            
        }

        else if(product.category === "tablets"){
            product.details.push({
                name: "Carrier",
                value: $("#carrier").val()
            });
            product.details.push({
                name: "Wireless Technology",
                value: $("#wirelessTech").val()
            });
            product.details.push({
                name: "Voice Assistant Built-in",
                value: $("#voiceAssistant").val()
            });
            product.details.push({
                name: "Rear-Facing Camera",
                value: $("#camera").val()
            });
            product.details.push({
                name: "Brand",
                value: $("#tabletBrand").val()
            });
            product.details.push({
                name: "Bluetooth Enabled",
                value: $('[name="bluetoothEnabled"]').val()
            });
            product.details.push({
                name: "Keyboard Type",
                value: $("#kbType").val()
            });
            product.details.push({
                name: "Wireless Compatibility",
                value: $("#wirelessCompatability").val()
            });
        }

        else if(product.category === "phones"){
            product.details.push({
                name: "Total Storage Capacity",
                value: $("#phoneStorage").val()
            });
            product.details.push({
                name: "System Memory (RAM)",
                value: $("#ram-phones").val()
            });
            product.details.push({
                name: "Wireless Connectivity",
                value: $("#wirelessConnectivity").val()
            });
            product.details.push({
                name: "Battery Type",
                value: $("#phoneBatteryType").val()
            });
        }
        product = inputValidation(product);

        if(errorList.length < 1){
            var requestConfig = {
                method: "PUT",
                url: "/api/admin",
                contentType: "application/json",
                data: JSON.stringify(product),
            };
    
            $.ajax(requestConfig).then(function (responseMessage){
                console.log({responseMessage});
                if(responseMessage.error){
                    errorDiv.removeClass("hidden");
                    errorLi.append($("<li>").text(responseMessage.error));
                }
                else{
                    alert(responseMessage.responseMessage);
                    window.location.href = "/api/admin";
                }
            });
        }
        else{
            console.log(errorList);
            for(let msg of errorList){
                errorDiv.removeClass("hidden");
                errorLi.append($("<li>").text(msg));
            }
        }
    });
})(window.jQuery);