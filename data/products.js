const mongoCollections = require('../config/mongoCollections');
const products = mongoCollections.products;
const axios = require('axios');
const validation = require('../validation');

let exportedMethods = {
    //user
    async getProductsByID(skuId) {
        //validation start
        skuId = skuId;
        //validation end
        const productCollection = await products();
        let product = await productCollection.findOne({ _id: skuId });
        if (!product) throw `Product ${skuId} not found`;
        return product;
    },
    async updateProductVisitedCounter(skuId) {
        //validation start
        skuId = skuId;
        //validation end
        let product = await this.getProductsByID(skuId);

        const productCollection = await products();
        product.visitedTimes++;
        const updatedInfo = await productCollection.updateOne({_id: skuId}, {$set: {visitedTimes: product.visitedTimes}});
        if(updatedInfo.modifiedCount === 0) throw "Could not update the product with the counter";

        let updatedProduct = this.getProductsByID(skuId);
        return updatedProduct;
    },
    async getAllProducts() {
        const productCollection = await products();
        const productList = await productCollection.find({}).toArray();
        if (!productList) throw 'Product not found';
        return productList;
    },
    async getProductByName(Name) {
        //validation start
        Name = Name;
        //validation end
        Name = Name.split(" ")
        if (Name.length > 1) {
            Name = "\"" + Name.join("\" \"") + "\"";
        }
        else {
            Name = "\"" + Name + "\"";
        }
        //validation end
        const productCollection = await products();
        //search - need create index and search by index
        let createIndex = await productCollection.createIndex({ "name": "text" })
        let product = await productCollection.find({ $text: { $search: Name } }).toArray()
        if (!product) throw 'Product not found';
        return product;
    },
    async getCategoryOfProducts() {
        const productCollection = await products();
        let product = await productCollection.distinct("category")
        if (!product) throw 'Product not found';
        return product;
    },
    async getManufacturersOfProductsByCategory(category) {
        //validation start 
        category = category
        //validation end
        const productCollection = await products();
        let product = await productCollection.distinct("manufacturer", { category: category })
        if (!product) throw 'Product not found';
        return product;
    },
    async getProductsByManufacturer(manufacturer) {
        //validation start
        manufacturer = manufacturer;
        //validation end
        const productCollection = await products();
        let product = await productCollection.find({ manufacturer: manufacturer }).toArray()
        if (!product) throw 'Product not found';
        return product;
    },
    async getProductsByCategoryAndManufacturer(category, manufacturer) {
        //validation start
        category = category
        manufacturer = manufacturer
        //validation end
        const productCollection = await products();
        //let product = await productCollection.distinct("_id", { category: category, manufacturer: manufacturer })
        let product = await productCollection.find({ category: category, manufacturer: manufacturer }).toArray()
        if (!product) throw 'Product not found';
        return product;
    },
    async getProductsByCategory(category) {
        //validation start
        category = category;
        //validation end
        const productCollection = await products();
        let product = await productCollection.find({ category: category }).toArray()
        if (!product) throw 'Product not found';
        return product;
    },
    //get product by release date andcategory
    async getProductsByReleaseDateandCategory(releaseDate,category) {
        //validation start
        category = category;
        //validation end
        const productCollection = await products();
        let product = await productCollection.find({ category: category,
        releaseDate:releaseDate }).toArray()
        if (!product) throw 'Product not found';
        return product;
    },
    //sort by reviews 
    async sortProductsByReviews() {
    },
    //show by price
    //db.marks.find({ "price": { "$gt": low, '$lt': high} })
    //user fixes
    async compareLaptops(productsListSKU) {
        // validation of SKU list
        // total 5 products
        productsListSKU = productsListSKU
        // validation end
        // productsListSKU array of SKU 
        let comapreList = []
        let errors = []
        for (let i = 0; i < productsListSKU.length; i++) {
            try {
                let laptop = await this.getProductsByID(Number(productsListSKU[i]))
                //object
                //we want to check if this object contains some of the details
                //check if category is laptop (if not ask to remove it)
                if (laptop.category === "laptops") {
                    let details = laptop.details
                    let product = {
                        "sku": laptop._id,
                        "name": laptop.name,
                        "url": laptop.url,
                        "Price":'$'+laptop.price,
                        "Rating": laptop.customerReviewAverage,
                        "Processor Model": "",
                        "System Memory (RAM)": "",
                        "Graphics": "",
                        "Screen Resolution": "",
                        "Storage Type": "",
                        "Total Storage Capacity": "",
                        "Screen Size": "",
                        "Touch Screen": "",
                        "Processor Model Number": "",
                        "Operating System": "",
                        "Battery Type": "",
                        "Backlit Keyboard": "",
                        "Brand": "",
                        "Model Number": "",
                        "Year of Release": "",
                        "Color Category": "",
                    }
                    let list = ["Processor Model", "System Memory (RAM)", "Graphics", "Screen Resolution", "Storage Type", "Total Storage Capacity", "Screen Size", "Touch Screen", "Processor Model Number", "Operating System", "Battery Type", "Backlit Keyboard", "Brand", "Model Number", "Year of Release", "Color Category"]
                    for (let i = 0; i < list.length; i++) {
                        let temp = details.find(temp => temp.name === list[i])
                        if (temp === undefined) {
                            product[list[i]] = "null";
                        } else {
                            product[list[i]] = temp.value
                        }
                    }
                    comapreList.push(product)
                } else {
                    errors.push({ error: `Product:${productsListSKU[i]} not a laptop, you need to use ${laptop.category} category` })
                }
            } catch (e) {
                console.log(e);
                errors.push({ error: `Product id:${productsListSKU[i]} not found` })
            }
        }
        return [comapreList, errors];
    },
    //user fixes
    async comparePhones(productsListSKU) {
        // validation of SKU list
        // total 5 products
        productsListSKU = productsListSKU
        // validation end
        // productsListSKU array of SKU 
        let comapreList = []
        let errors = []
        for (let i = 0; i < productsListSKU.length; i++) {
            try {
                let phone = await this.getProductsByID(productsListSKU[i])
                //object
                //we want to check if this object contains some of the details
                //check if category is laptop (if not ask to remove it)
                if (phone.category === "phones") {
                    let details = phone.details
                    let product = {
                        "sku": phone._id,
                        "name": phone.name,
                        "url": phone.url,
                        "Screen Size": "",
                        "Screen Resolution": "",
                        "Total Storage Capacity": "",
                        "System Memory (RAM)": "",
                        "Processor Model": "",
                        "Operating System": "",
                        "Wireless Connectivity": "",
                        "Battery Type": "",
                        "Year of Release": "",
                        "Color": ""
                    }
                    let list = ["Screen Size", "Screen Resolution", "Total Storage Capacity", "System Memory (RAM)", "Processor Model", "Operating System", "Wireless Connectivity", "Battery Type", "Year of Release", "Color"]
                    for (let i = 0; i < list.length; i++) {
                        let temp = details.find(temp => temp.name === list[i])
                        if (temp === undefined) {
                            product[list[i]] = "null";
                        } else {
                            product[list[i]] = temp.value
                        }
                    }
                    comapreList.push(product)
                } else {
                    errors.push({ error: `Product:${productsListSKU[i]} not a phone, you need to use ${laptop.category} category` })
                }
            } catch (e) {
                errors.push({ error: `Product id:${productsListSKU[i]} not found` })
            }
        }
        return [comapreList, errors];
    },
    //user fixes
    async compareTablets(productsListSKU) {

        // validation of SKU list
        // total 5 products
        productsListSKU = productsListSKU
        // validation end
        // productsListSKU array of SKU 
        let comapreList = []
        let errors = []
        for (let i = 0; i < productsListSKU.length; i++) {
            try {
                let tablet = await this.getProductsByID(productsListSKU[i])
                if (tablet.category === "tablets") {
                    let details = tablet.details
                    let product = {
                        "sku": tablet._id,
                        "name": tablet.name,
                        "url": tablet.url,
                        "Carrier": "",
                        "Wireless Technology": "",
                        "Operating System": "",
                        "Screen Size": "",
                        "Screen Resolution": "",
                        "Processor Model": "",
                        "Voice Assistant Built-in": "",
                        "Rear-Facing Camera": "",
                        "Product Name": "",
                        "Brand": "",
                        "Color": "",
                        "Bluetooth Enabled": "",
                        "Keyboard Type": "",
                        "Wireless Compatibility": ""
                    }
                    let list = ["Carrier", "Wireless Technology", "Operating System", "Screen Size", "Screen Resolution", "Processor Model", "Voice Assistant Built-in", "Rear-Facing Camera", "Product Name", "Brand", "Color", "Bluetooth Enabled", "Keyboard Type", "Wireless Compatibility"]
                    for (let i = 0; i < list.length; i++) {
                        let temp = details.find(temp => temp.name === list[i])
                        if (temp === undefined) {
                            product[list[i]] = "null";
                        } else {
                            product[list[i]] = temp.value
                        }
                    }
                    comapreList.push(product)
                } else {
                    errors.push({ error: `Product:${productsListSKU[i]} not a tablet, you need to use ${laptop.category} category` })
                }
            } catch (e) {
                errors.push({ error: `Product id:${productsListSKU[i]} not found` })
            }
        }
        return [comapreList, errors];
    },

    //admin
    async addProduct(
        sku,
        name,
        manufacturer,
        startDate,
        price,
        url,
        inStoreAvailability,
        Description,
        pictures,
        details,
    ) {
        //validation start
        sku = sku; // length 7 all numbers
        try {
            let a = 0
            a = await this.getProductsByID(sku)
            if (a !== 0) {
                return `Product with id: ${sku} exists`
            }
        }
        catch (e) {
            console.log(e);
        }
        name = name; // Name
        manufacturer = manufacturer; // manufacturer
        startDate = startDate;  // format 2022-04-06   
        price = price // format 1399.00
        url = url; //Check if url is valid
        inStoreAvailability = inStoreAvailability; //True or False
        Description = Description; // Description if null
        pictures = pictures; // if null dont show
        details = details; // array with objects
        //validation end
        //static
        customerReviewAverage = 0
        customerReviewCount = 0
        reviews = [];

        let visitedTimes = 0;
        let comments = [];
        let qna = [];

        const productCollection = await products();

        let newProduct = {
            _id: sku,
            name,
            customerReviewAverage,
            customerReviewCount,
            manufacturer,
            startDate,
            price,
            url,
            inStoreAvailability,
            Description,
            pictures,
            details,
            reviews,
            visitedTimes,
            comments,
            qna
        };
        const newInsertInformation = await productCollection.insertOne(newProduct);
        if (newInsertInformation.insertedCount === 0) throw 'Insert failed!';
        return `Product been added with id: ${sku}`;
    },
    async removeProduct(skuId) {
        //validation start
        skuId = ParseInt(skuId);
        //validation end
        const productCollection = await products();
        const product = await productCollection.findOne({ _id: skuId });
        const deletionInfo = await productCollection.deleteOne({ _id: skuId });
        if (deletionInfo.deletedCount === 0) {
            throw `Could not delete product with id of ${skuId}`;
        }
        return `${skuId} has been successfully deleted!`;
    },
    async updateProduct(
        sku,
        name,
        manufacturer,
        startDate,
        price,
        url,
        inStoreAvailability,
        Description,
        pictures,
        details
    ) {
        sku = sku; // length 7 all numbers
        name = name; // Name
        manufacturer = manufacturer; // manufacturer
        startDate = startDate;  // format 2022-04-06   
        price = price // format 1399.00
        url = url; //Check if url is valid
        inStoreAvailability = inStoreAvailability; //True or False
        Description = Description; // Description if null
        pictures = pictures; // if null dont show
        details = details; // array with objects

        let productUpdateInfo = {
            name,
            manufacturer,
            startDate,
            price,
            url,
            inStoreAvailability,
            Description,
            pictures,
            details
        }
        const productCollection = await products();
        const updateInfo = await productCollection.updateOne(
            { _id: sku },
            { $set: productUpdateInfo }
        );
        if (!updateInfo.matchedCount && !updateInfo.modifiedCount)
            throw 'Update failed';
        return `Product ${sku} been updated`;
    },
    //admin API_KEY
    async getProductsByAxios1(page, key, API_KEY) {
        const { data } = await axios.get(`https://api.bestbuy.com/v1/products(releaseDate>=2021-01-01&releaseDate<=today&(categoryPath.id=${key}))?apiKey=${API_KEY}&sort=name.asc&show=sku,name,customerReviewAverage,customerReviewCount,color,manufacturer,startDate,regularPrice,salePrice,onSale,url,inStoreAvailability,shortDescription,longDescription,largeFrontImage,accessoriesImage,alternateViewsImage,angleImage,backViewImage,energyGuideImage,image,leftViewImage,remoteControlImage,rightViewImage,topViewImage,details.name&facet=manufacturer&pageSize=100&page=${page}&format=json`)
            .catch((e) => {
                throw 'URL is not found';
            });
        return data.products;
    },
    async getProductsByAxios(key, API_KEY) {
        const { data } = await axios.get(`https://api.bestbuy.com/v1/products(releaseDate>=2021-01-01&releaseDate<=today&(categoryPath.id=${key}))?apiKey=${API_KEY}&sort=name.asc&show=sku,name,customerReviewAverage,customerReviewCount,color,manufacturer,startDate,regularPrice,salePrice,onSale,url,inStoreAvailability,shortDescription,longDescription,largeFrontImage,accessoriesImage,alternateViewsImage,angleImage,backViewImage,energyGuideImage,image,leftViewImage,remoteControlImage,rightViewImage,topViewImage,details.name&facet=manufacturer&pageSize=100&page=1&format=json`)
            .catch((e) => {
                throw 'URL is not found';
            });
        let final = [];
        console.log(data.totalPages)
        if (data.totalPages > 1) {
            for (let i = 1; i <= data.totalPages; i++) {
                final = final.concat(await this.getProductsByAxios1(i, key, API_KEY))
                console.log(final.length)
            }
        }
        else {
            final = data.products
        }
        return final; // this will be the array of people objects
    },
    //Will return the Top 5 popular products in each category
    async getPopularProducts(){
        const productCollection = await products();

        const popularLaptops = await productCollection.find({category:"laptops"})
                                                        .sort({visitedTimes:-1}).limit(5).toArray();
        if(!popularLaptops) throw "Error: Could not fetch popular Laptops from DB";

        const popularPhones = await productCollection.find({category:"phones"})
                                                        .sort({visitedTimes:-1}).limit(5).toArray();
        if(!popularPhones) throw "Error: Could not fetch popular phones from DB";

        const popularTablets = await productCollection.find({category:"tablets"})
                                                        .sort({visitedTimes:-1}).limit(5).toArray();
        if(!popularTablets) throw "Error: Could not fetch popular tablets from DB";

        const popularProducts = {
            laptops: popularLaptops,
            phones: popularPhones,
            tablets: popularTablets
        };

        return popularProducts;
    },
    async addProductByAxios(
        sku,
        name,
        customerReviewAverage,
        customerReviewCount,
        manufacturer,
        startDate,
        regularPrice,
        salePrice,
        onSale,
        url,
        inStoreAvailability,
        shortDescription,
        longDescription,
        largeFrontImage,
        accessoriesImage,
        alternateViewsImage,
        angleImage,
        backViewImage,
        energyGuideImage,
        image,
        leftViewImage,
        remoteControlImage,
        rightViewImage,
        topViewImage,
        details,
        category
    ) {
        //validation start
        sku = sku; // length 7 all numbers
        name = name; // Name
        customerReviewAverage = customerReviewAverage; // 4.56
        customerReviewCount = customerReviewCount; // 6 full integer
        manufacturer = manufacturer; // manufacturer
        startDate = startDate;  // format 2022-04-06
        regularPrice = regularPrice; // format 1499.00
        salePrice = salePrice; // format 1499.00
        onSale = onSale; //True or False
        url = url; //Check if url is valid
        inStoreAvailability = inStoreAvailability; //True or False
        shortDescription = shortDescription; // Description if null
        longDescription = longDescription; // Description if null

        details = details; // array with objects
        category = category // what is it (laptop)
        //validation end 
        // fixes start
        //static
        reviews = []
        //price 
        if (onSale) {
            price = salePrice;
        } else {
            price = regularPrice;
        }
        //pictures
        pictures = [
            largeFrontImage,
            accessoriesImage,
            alternateViewsImage,
            angleImage,
            backViewImage,
            energyGuideImage,
            image,
            leftViewImage,
            remoteControlImage,
            rightViewImage,
            topViewImage]
        for (let i = 0; i < pictures.length; i++) {
            if (pictures[i] === null) {
                pictures.splice(i, 1);
                i--;
            }
        }
        //Description
        if (shortDescription === null) {
            Description = longDescription
        } else {
            Description = shortDescription
        }
        //details
        let fixDetails = [];
        for (let i in details) {
            let temp = {}
            temp["name"] = details[i].name
            temp["value"] = details[i].value
            fixDetails.push(temp);
        }
        details = fixDetails;
        // fixes end
        let visitedTimes = 0;
        let comments = [];
        let qna = [];

        const productCollection = await products();
        let newProduct = {
            _id: sku,
            name,
            customerReviewAverage,
            customerReviewCount,
            manufacturer,
            startDate,
            price,
            url,
            inStoreAvailability,
            Description,
            pictures,
            details,
            category,
            reviews,
            visitedTimes,
            comments,
            qna
        };
        const newInsertInformation = await productCollection.insertOne(newProduct);
        if (newInsertInformation.insertedCount === 0) throw 'Insert failed!';
        return `Product been added with id: ${sku}`;
    },
}

module.exports = exportedMethods;
