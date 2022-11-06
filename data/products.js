const mongoCollections = require('../config/mongoCollections');
const products = mongoCollections.products;
const { ObjectId } = require('mongodb');
const validation = require('../validation');

let exportedMethods = {
    async getAllProducts() {
        const productCollection = await products();
        const procuctsList = await productCollection.find({}).toArray();
        if (!procuctsList) throw 'No users in system!';
        return procuctsList;
    },
    async getLaptopByID(id) {
        //validation start
        id = id;
        //validation end
        const productCollection = await products();
        const laptop = await productCollection.findOne({ _id: id });
        if (!laptop) throw 'Laptop not found';
        return laptop;
    },
    async getPhoneByID(id) {
        //validation start
        id = id;
        //validation end
        const productCollection = await products();
        const phone = await productCollection.findOne({ _id: id });
        if (!phone) throw 'Phone not found';
        return phone;
    },
    async getTabletByID(id) {
        //validation start
        id = id;
        //validation end
        const productCollection = await products();
        const tablet = await productCollection.findOne({ _id: id });
        if (!tablet) throw 'Tablet not found';
        return tablet;
    },
    async addLaptop(
        Laptop
    ) {
        //validation start
        Laptop = Laptop;
        //validation end
        let newLaptop = {
            Laptop: Laptop
        }
    },
    async addPhone(
        Phone
    ) {
        //validation start
        Phone = Phone;
        //validation end
    },
    async addTablet(
        Tablet
    ) {
        //validation start
        Tablet = Tablet;
        //validation end
    },
    async updateLaptop(
        Laptop
    ) {
        //validation start
        Laptop = Laptop;
        //validation end
    },
    async updatePhone(
        Phone
    ) {
        //validation start
        Phone = Phone;
        //validation end
    },
    async updateTablet(
        Tablet
    ) {
        //validation start
        Tablet = Tablet;
        //validation end
    },
    async removeLaptop(
        Laptop
    ) {
        //validation start
        Laptop = Laptop;
        //validation end
    },
    async removePhone(
        Phone
    ) {
        //validation start
        Phone = Phone;
        //validation end
    },
    async removeTablet(
        Tablet
    ) {
        //validation start
        Tablet = Tablet;
        //validation end
    }


}

module.exports = exportedMethods;