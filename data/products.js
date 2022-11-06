const mongoCollections = require('../config/mongoCollections');
const products = mongoCollections.products;

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
    }

}

module.exports = exportedMethods;