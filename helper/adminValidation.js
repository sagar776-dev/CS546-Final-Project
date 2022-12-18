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
        throw(`${input} should not be empty`);
    }
    else{
        value = value.trim();
        if(value.length < 1)
            throw(`${input} should not be empty`);
        else if(value.length < 2)
            throw(`${input} should be at least 2 characters long`);
    }
    return value;
}

function alphanumericStringValidation(input, value){
    if(!value){
        throw(`${input} should not be empty`);
    }
    else{
        value = value.trim();
        if(value.length < 1)
            throw(`${input} should not be empty`);
        else if(value.length < 2)
            throw(`${input} should be at least 2 characters long`);
    }
    return value;
}

function validateSkuId(skuId){
    if(!skuId){
        throw("Product Id should not be empty");
    }else{
            skuId = skuId.toString().trim();
            if(isNaN(skuId))
                throw("Product Id must be a number");
            else if(skuId.includes("."))
                throw("product id must be an Integer");
            else if(skuId.length !== 7)
                throw("Product Id must be 7 Characters Long");
    }
    return parseInt(skuId);
}

function validateReleaseDate(date){
    if (!date) throw 'You must provide a release date for your Movie';
    if (typeof date !== 'string') throw 'runtime must be a string';
    if (date.trim().length === 0)
        throw 'date cannot be an empty string or string with just spaces';
    date = date.trim();
    return date;
}

function inputValidation(product){
    if(!product.name)
        throw("Product Name should not be empty");
    else{
        product.name = product.name.trim();
        if(product.name.length < 1)
            throw("Product name should not be empty");
        else if(product.name.length < 6)
            throw("Product Name should have atleast 6 characters");
    }

    if(!product.manufacturer){
        throw("Manufacturer should not be empty");
    }
    else{
        product.manufacturer = product.manufacturer.trim();
        if(product.manufacturer.length < 1)
            throw("Manufacturer should not be empty");
        else if(product.manufacturer.length < 2)
            throw("Manufacturer should be at least 2 characters long");
    }

    product.startDate = validateReleaseDate(product.startDate);

    if(!product.price){
        throw("Price should not be empty");
    }
    else{
        product.price = product.price.toString().trim();
        if(product.price.length < 1)
            throw("Price should not be empty");
        else if(isNaN(product.price))
            throw("Price should be a number");
        else if(product.price <= 0)
            throw("Price must be greater than Zero");
        product.price = parseFloat(product.price);
    }

    if(!product.url){
        throw("URL should not be empty");
    }
    else{
        product.url = product.url.trim();
        if(product.url.length < 1)
            throw("URL should not be empty");
        else if(!isValidURL(product.url))
            throw("Invalid URL for the Product");
    }

    if(!product.Description){
        throw("Description should not be empty");
    }
    else{
        product.Description = product.Description.trim();
        if(product.Description.length < 1)
            throw("Description should not be empty");
        else if(product.Description.length < 5)
            throw("Description should be at least 5 characters long");
    }

    if(!product.category){
        throw("Must select one of the three categories");
    }
    
    // if(!product.pictures){
    //     throw("At least one picture must be uploaded");
    // }

    if(product.details.length < 1){
        throw("Must enter specification details");
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

module.exports = {
    inputValidation,
    validateSkuId
};