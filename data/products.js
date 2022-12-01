const mongoCollections = require('../config/mongoCollections');
const products = mongoCollections.products;

const axios = require('axios');
const validation = require('../validation');

let exportedMethods = {
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
        let QandA = [];

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
            QandA
        };
        const newInsertInformation = await productCollection.insertOne(newProduct);
        if (newInsertInformation.insertedCount === 0) throw 'Insert failed!';
        return `Product been added with id: ${sku}`;
    },
    async removeProduct(skuId) {
        //validation start
        skuId = skuId;
        //validation end
        const productCollection = await products();
        const product = await productCollection.findOne({ _id: skuId });
        const deletionInfo = await productCollection.deleteOne({ _id: skuId });
        if (deletionInfo.deletedCount === 0) {
            throw `Could not delete product with id of ${skuId}`;
        }
        return `${skuId} has been successfully deleted!`;
    },
    async getProductsByID(skuId) {
        //validation start
        skuId = skuId;
        //validation end
        const productCollection = await products();
        let product = await productCollection.findOne({ _id: skuId });
        if (!product) throw `Product ${skuId} not found`;
        return product;
    },
    //admin fix (pictures, details)
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
    //user
    async getAllProducts() {
        const productCollection = await products();
        const productList = await productCollection.find({}).toArray();
        if (!productList) throw 'Product not found';
        return productList;
    },
    async getProductByName(Name) {
        //validation start

        //validation end
        Name = Name.split(" ")
        if (Name.length > 1) {
            Name = "\"" + Name.join("\" \"") + "\"";
        }
        else {
            Name = "\"" + Name + "\"";
        }
        //console.log(Name);
        //validation end
        const productCollection = await products();
        //search - need create index and search by index
        let createIndex = await productCollection.createIndex({ "name": "text" })
        let product = await productCollection.find({ $text: { $search: Name } }).toArray()
        if (!product) throw 'Product not found';
        if (product.length === 0) throw 'Incorrect name'
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
    //sort by reviews 
    async sortProductsByReviews() {

    },
    //sort by prices 
    async sortProductsByPrices() {

    },
    //user fixes
    async comparelaptops(...productsListSKU) {
        let temp = []
        for (let i = 0; i < productsListSKU.length; i++) {
            try {
                let a = await this.getProductsByID(productsListSKU[i])

                //{"category":"laptops"}

                //{"details.name":"Processor Model"}
                //{"details.name":"System Memory (RAM)"}
                //{"details.name":"Graphics"}
                //{"details.name":"Screen Resolution"}
                //{"details.name":"Storage Type"}
                //{"details.name":"Total Storage Capacity"}
                //{"details.name":"Screen Size"}

                //{"details.name":"Touch Screen"}
                //{"details.name":"Processor Model Number"}
                //{"details.name":"Operating System"}
                //{"details.name":"Battery Type"}
                //{"details.name":"Backlit Keyboard"}
                //{"details.name":"Brand"}
                //{"details.name":"Model Number"}
                //{"details.name":"Year of Release"}
                //{"details.name":"Color Category"}

                temp.push(a)
            } catch (e) {
                temp.push({ error: `Product id:${productsListSKU[i]} not found` })
            }
        }
        return temp;
    },
    //show by price
    //db.marks.find({ "price": { "$gt": low, '$lt': high} })

    //sort by name
    //sort by average reviews

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
        let QandA = [];

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
            QandA
        };
        const newInsertInformation = await productCollection.insertOne(newProduct);
        if (newInsertInformation.insertedCount === 0) throw 'Insert failed!';
        return `Product been added with id: ${sku}`;
    }
}

module.exports = exportedMethods;
