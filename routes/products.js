const express = require("express");
const router = express.Router();
const data = require("../data");
const productData = data.products;
// const validation = require('../helpers');
const path = require("path");
const { type } = require("os");

router.route("/").get(async (req, res) => {
  let url_query = req.query;
  //move to validation - object to lowercase
  let key,
    keys = Object.keys(url_query);
  let n = keys.length;
  let newobj = {};
  while (n--) {
    key = keys[n];
    newobj[key.toLowerCase()] = url_query[key];
  }
  //
  //validation start
  let page = parseInt(newobj.page);
  if (!page) {
    page = 1;
  }
  let search = newobj.search;
  //validation end
  let error = [];
  try {
    let productList = 0;
    if (!search) {
      productList = await productData.getAllProducts();
    } else {
      productList = await productData.getProductByName(search);
      if (productList.length === 0) {
        productList = await productData.getAllProducts();
        error.push(`Product with a name of "${search}" Not Found`);
      }
    }
    let categoryList = await productData.getCategoryOfProducts();
    //const page = 1
    current = page;
    if (current < 1) {
      current = 1;
      pageNext = current + 1;
      pagePrevious = current - 1;
      error.push(
        `If you using a URL, you exceeded a page size. So we move you to the first page of products.`
      );
    }
    if (current > parseInt(productList.length / 10) + 1) {
      current = parseInt(productList.length / 10);
      pageNext = current + 1;
      pagePrevious = current - 1;
      error.push(
        `If you using a URL, you exceeded a page size. So we move you to the last page of products.`
      );
    } else {
      pageNext = current + 1;
      pagePrevious = current - 1;
    }
    if (pageNext > parseInt(productList.length / 10)) {
      pageNext = NaN;
    }
    const limit = 10;
    const startIndex = (current - 1) * limit;
    const endIndex = current * limit;
    const resultsProducts = {};

    resultsProducts.page = {
      search: search,
      current: current,
      next: pageNext,
      previous: pagePrevious,
      limit: limit,
    };
    resultsProducts.results = productList.slice(startIndex, endIndex);
    //pagination end
    res.render("products/listOfProducts", {
      productList: resultsProducts,
      categoryList: categoryList,
      error: error,
    });
  } catch (e) {
    return res.status(404).json("products/listOfProducts", { error: e });
  }
});
// .post(async (req, res) => {
//     //need a jquary
//     let name = req.body.ProductName;
//     //validation start
//     name = name
//     //validation end
//     try {
//         let productList = {}
//         productList.results = await productData.getProductByName(name);
//         res.render('products/listOfProducts', { productList: productList });
//     } catch (e) {
//         return res.status(404).render('products/listOfProducts', { error: e });
//     }
// })
//laptops
router.route("/laptops").get(async (req, res) => {
  //move to validation - object to lowercase
  let url_query = req.query;
  let key,
    keys = Object.keys(url_query);
  let n = keys.length;
  let newobj = {};
  while (n--) {
    key = keys[n];
    newobj[key.toLowerCase()] = url_query[key];
  }
  //
  let search = newobj.search;
  if (search != undefined) {
    return res.redirect(`http://localhost:3000/products?search=${search}`);
  }
  //validation start
  let page = parseInt(newobj.page);
  if (!page) {
    page = 1;
  }
  let manufacturer = newobj.manufacturer;
  let error = [];
  try {
    let productList = 0;
    if (!manufacturer) {
      productList = await productData.getProductsByCategory("laptops");
    } else {
      productList = await productData.getProductsByCategoryAndManufacturer(
        "laptops",
        manufacturer
      );
    }
    let manufactort_List =
      await productData.getManufacturersOfProductsByCategory("laptops");
    //pagination start
    //fix later
    current = page;
    if (current < 1) {
      current = 1;
      pageNext = current + 1;
      pagePrevious = current - 1;
      error.push(
        `If you using a URL, you exceeded a page size. So we move you to the first page of products.`
      );
    }
    if (current > parseInt(productList.length / 10) + 1) {
      current = parseInt(productList.length / 10) + 1;
      pageNext = current + 1;
      pagePrevious = current - 1;
      error.push(
        `If you using a URL, you exceeded a page size. So we move you to the last page of products.`
      );
    } else {
      pageNext = current + 1;
      pagePrevious = current - 1;
    }
    if (pageNext > 1 + parseInt(productList.length / 10)) {
      pageNext = NaN;
    }
    const limit = 10;
    const startIndex = (current - 1) * limit;
    const endIndex = current * limit;
    const resultsProducts = {};
    resultsProducts.page = {
      manufacturer: manufacturer,
      current: current,
      next: pageNext,
      previous: pagePrevious,
      limit: limit,
    };
    resultsProducts.results = productList.slice(startIndex, endIndex);
    //pagination end
    res.render("products/listOfProducts", {
      productList: resultsProducts,
      manufactort_List: manufactort_List,
      error: error,
    });
  } catch (e) {
    return res
      .status(404)
      .render("products/listOfProducts", { error: "Laptops not found" });
  }
});
router.get("/laptops/:id", async (req, res) => {
  try {
    //move to validation - object to lowercase
    let url_query = req.query;
    let key,
      keys = Object.keys(url_query);
    let n = keys.length;
    let newobj = {};
    while (n--) {
      key = keys[n];
      newobj[key.toLowerCase()] = url_query[key];
    }
    //
    let search = newobj.search;
    if (search != undefined) {
      return res.redirect(`http://localhost:3000/products?search=${search}`);
    }
    //move to validation
    let sku = parseInt(req.params.id);
    //validation start
    sku = sku;
    //validation end
    let product = await productData.getProductsByID(sku);
    // check category of sku
    //cause we can use same id for tablets and phones
    if (product.category !== "laptops") {
      return res
        .status(404)
        .render("products/productPage", { error: "Product not found" });
    }
    // end
    res.render("products/productPage", {
      product: product,
      pictures: product.pictures,
      details: product.details,
    });
  } catch (e) {
    return res
      .status(404)
      .render("products/error", { error: "Product not found" });
  }
});
//phones
router.route("/phones").get(async (req, res) => {
  //move to validation - object to lowercase
  let url_query = req.query;
  let key,
    keys = Object.keys(url_query);
  let n = keys.length;
  let newobj = {};
  while (n--) {
    key = keys[n];
    newobj[key.toLowerCase()] = url_query[key];
  }
  //
  let search = newobj.search;
  if (search != undefined) {
    return res.redirect(`http://localhost:3000/products?search=${search}`);
  }
  //move to validation
  //validation start
  let page = parseInt(newobj.page);
  if (!page) {
    page = 1;
  }
  let manufacturer = newobj.manufacturer;
  let error = [];
  try {
    let productList = 0;
    if (!manufacturer) {
      productList = await productData.getProductsByCategory("phones");
    } else {
      productList = await productData.getProductsByCategoryAndManufacturer(
        "phones",
        manufacturer
      );
    }
    let manufactort_List =
      await productData.getManufacturersOfProductsByCategory("phones");
    //pagination start
    //fix later
    current = page;
    if (current < 1) {
      current = 1;
      pageNext = current + 1;
      pagePrevious = current - 1;
      error.push(
        `If you using a URL, you exceeded a page size. So we move you to the first page of products.`
      );
    }
    if (current > parseInt(productList.length / 10) + 1) {
      current = parseInt(productList.length / 10) + 1;
      pageNext = current + 1;
      pagePrevious = current - 1;
      error.push(
        `If you using a URL, you exceeded a page size. So we move you to the last page of products.`
      );
    } else {
      pageNext = current + 1;
      pagePrevious = current - 1;
    }
    if (pageNext > 1 + parseInt(productList.length / 10)) {
      pageNext = NaN;
    }
    const limit = 10;
    const startIndex = (current - 1) * limit;
    const endIndex = current * limit;
    const resultsProducts = {};
    resultsProducts.page = {
      manufacturer: manufacturer,
      current: current,
      next: pageNext,
      previous: pagePrevious,
      limit: limit,
    };
    resultsProducts.results = productList.slice(startIndex, endIndex);
    //pagination end
    res.render("products/listOfProducts", {
      productList: resultsProducts,
      manufactort_List: manufactort_List,
      error: error,
    });
  } catch (e) {
    return res
      .status(404)
      .render("products/listOfProducts", { error: "Phones not found" });
  }
});
router.get("/phones/:id", async (req, res) => {
  try {
    //move to validation - object to lowercase
    let url_query = req.query;
    let key,
      keys = Object.keys(url_query);
    let n = keys.length;
    let newobj = {};
    while (n--) {
      key = keys[n];
      newobj[key.toLowerCase()] = url_query[key];
    }
    //
    let search = newobj.search;
    if (search != undefined) {
      return res.redirect(`http://localhost:3000/products?search=${search}`);
    }
    //move to validation
    let sku = parseInt(req.params.id);
    //validation start
    sku = sku;
    //validation end
    let product = await productData.getProductsByID(sku);
    if (product.category !== "phones") {
      return res
        .status(404)
        .render("products/productPage", { error: "Product not found" });
    }
    res.render("products/productPage", {
      product: product,
      pictures: product.pictures,
      details: product.details,
    });
  } catch (e) {
    return res
      .status(404)
      .render("products/error", { error: "Product not found" });
  }
});
//tablets
router.route("/tablets").get(async (req, res) => {
  //move to validation - object to lowercase
  let url_query = req.query;
  let key,
    keys = Object.keys(url_query);
  let n = keys.length;
  let newobj = {};
  while (n--) {
    key = keys[n];
    newobj[key.toLowerCase()] = url_query[key];
  }
  //
  let search = newobj.search;
  if (search != undefined) {
    return res.redirect(`http://localhost:3000/products?search=${search}`);
  }
  //move to validation
  //validation start
  let page = parseInt(newobj.page);
  if (!page) {
    page = 1;
  }
  let manufacturer = newobj.manufacturer;
  let error = [];
  try {
    let productList = 0;
    if (!manufacturer) {
      productList = await productData.getProductsByCategory("tablets");
    } else {
      productList = await productData.getProductsByCategoryAndManufacturer(
        "tablets",
        manufacturer
      );
    }
    let manufactort_List =
      await productData.getManufacturersOfProductsByCategory("tablets");
    //pagination start
    //fix later
    current = page;
    if (current < 1) {
      current = 1;
      pageNext = current + 1;
      pagePrevious = current - 1;
      error.push(
        `If you using a URL, you exceeded a page size. So we move you to the first page of products.`
      );
    }
    if (current > parseInt(productList.length / 10) + 1) {
      current = parseInt(productList.length / 10) + 1;
      pageNext = current + 1;
      pagePrevious = current - 1;
      error.push(
        `If you using a URL, you exceeded a page size. So we move you to the last page of products.`
      );
    } else {
      pageNext = current + 1;
      pagePrevious = current - 1;
    }
    if (pageNext > 1 + parseInt(productList.length / 10)) {
      pageNext = NaN;
    }
    const limit = 10;
    const startIndex = (current - 1) * limit;
    const endIndex = current * limit;
    const resultsProducts = {};
    resultsProducts.page = {
      manufacturer: manufacturer,
      current: current,
      next: pageNext,
      previous: pagePrevious,
      limit: limit,
    };

    resultsProducts.results = productList.slice(startIndex, endIndex);
    //pagination end
    res.render("products/listOfProducts", {
      productList: resultsProducts,
      manufactort_List: manufactort_List,
      error: error,
    });
  } catch (e) {
    return res.status(404).render({ error: "Tablets not found" });
  }
});
router.get("/tablets/:id", async (req, res) => {
  try {
    //move to validation - object to lowercase
    let url_query = req.query;
    let key,
      keys = Object.keys(url_query);
    let n = keys.length;
    let newobj = {};
    while (n--) {
      key = keys[n];
      newobj[key.toLowerCase()] = url_query[key];
    }
    //
    let search = newobj.search;
    if (search != undefined) {
      return res.redirect(`http://localhost:3000/products?search=${search}`);
    }
    //move to validation
    let sku = parseInt(req.params.id);
    //validation start
    sku = sku;
    //validation end
    let product = await productData.getProductsByID(sku);

    if (product.category !== "tablets") {
      res
        .status(404)
        .render("products/productPage", { error: "Product not found" });
      return;
    }
    res.render("products/productPage", {
      product: product,
      pictures: product.pictures,
      details: product.details,
    });
  } catch (e) {
    res.status(404).render("products/error", { error: "Product not found" });
  }
});

router
  .get("/compare", async (req, res) => {
    let products = [
      {
        sku: 6447818,
        name: "Acer - Chromebook Spin 514 Laptop– Convertible-14” Full HD Touch –Ryzen 3 3250C– GB DDR4 Memory–64GB eMMC Flash Memory",
        url: "https://api.bestbuy.com/click/-/6447818/pdp",
        "Processor Model": "AMD Ryzen 3 3000 Series",
        "System Memory (RAM)": "4 gigabytes",
        Graphics: "AMD Radeon",
        "Screen Resolution": "1920 x 1080 (Full HD)",
        "Storage Type": "eMMC",
        "Total Storage Capacity": "64 gigabytes",
        "Screen Size": "14 inches",
        "Touch Screen": "Yes",
        "Processor Model Number": "3250C",
        "Operating System": "Chrome OS",
        "Battery Type": "Lithium-ion",
        "Backlit Keyboard": "Yes",
        Brand: "Acer",
        "Model Number": "CP514-1H-R4HQ",
        "Year of Release": "2020",
        "Color Category": "Silver",
      },
      {
        sku: 6518252,
        name: 'Dell - XPS 13 Plus 13.4" OLED Touch-Screen Laptop – 12th Gen Intel Evo i7 - 16GB Memory - 512GB SSD - Silver',
        url: "https://api.bestbuy.com/click/-/6518252/pdp",
        "Processor Model": "Intel 12th Generation Core i7 Evo Platform",
        "System Memory (RAM)": "16 gigabytes",
        Graphics: "Intel Iris Xe Graphics",
        "Screen Resolution": "3456 x 2160",
        "Storage Type": "SSD",
        "Total Storage Capacity": "512 gigabytes",
        "Screen Size": "13.4 inches",
        "Touch Screen": "Yes",
        "Processor Model Number": "1260P",
        "Operating System": "Windows 11 Home",
        "Battery Type": "Lithium-ion",
        "Backlit Keyboard": "Yes",
        Brand: "Dell",
        "Model Number": "BBY-K2PKKFX",
        "Year of Release": "2022",
        "Color Category": "Silver",
      },
    ];
    let headers = Object.keys(products[0]);
    let comparisonArray = [];
    for (let header of headers) {
      if (header.trim().toLowerCase() !== "sku") {
        let arr = [header.charAt(0).toUpperCase() + header.slice(1)];
        for (let product of products) {
          arr.push(product[header]);
        }
        comparisonArray.push(arr);
      }
    }
    res.render("products/compareproducts", {
      products: comparisonArray,
    });
  })
  .post("/compare", async (req, res) => {
    let errorMessage = "";
    let products = req.body;

    if (!products) errorMessage = "Error: No products to compare";
    else if (products.length === 0)
      errorMessage = "Error: No products to compare";
    else if (products.length === 1)
      errorMessage = "Error: Only one product in the compare list";

    if (errorMessage.length > 0) {
      throw errorMessage;
    }

    let prods = [];
    let categories = ["laptops", "phones", "tablets"];

    try {
      //Check for same category
      for (let prod in products) {
        if (!prods.includes(prod.type.toLowerCase())) {
          prods.push(prod.type.toLowerCase());
        }
      }
      if (prods.length !== 1)
        throw "Error: cannot compare products of different category";

      //Check for duplicate product
      prods = [];
      for (let prod in products) {
        if (!prods.includes(prod.sku)) {
          prods.push(prod.sku);
        }
      }
      if (prods.length !== products.length)
        throw "Error: cannot compare product with itself";

      if (flag) {
        let result;
        let productSKUs = [];
        for (let product of products) {
          productSKUs.push(product.sku);
        }
        if (products[0].type.toLowerCase() === "laptops") {
          result = await productData.compareLaptops(productSKUs);
        } else if (products[0].type.toLowerCase() === "phones") {
          result = await productData.comparePhones(productSKUs);
        } else {
          result = await productData.compareTablets(productSKUs);
        }
        console.log(result);
        res.json({ result: result });
      } else {
        console.log("Else error");
        res
          .status(404)
          .render("products/ProductError", { error: "Product not found" });
        return;
      }
    } catch (e) {
      console.log("error ", e);
      res
        .status(500)
        .render("products/ProductError", { error: "Something went wrong" });
      return;
    }
  });
//compareProducts not finished
module.exports = router;
