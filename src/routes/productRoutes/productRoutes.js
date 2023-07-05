const express = require('express');
const { productAdd, productList, productDelete, productDetailes, productUpdate, productSearch } = require('../../controller/ProductController');
const routerProduct = express.Router();
const auth = require('../../middleware/authMiddleware');

// New Product Add Route
routerProduct.route("/api/add-product").post(auth, productAdd);

// Product List Route
routerProduct.route("/api/products").get(auth, productList);

// Product Delete Route
routerProduct.route("/api/product/:id").delete(auth, productDelete);

// Product Detailes Route
routerProduct.route("/api/product/:id").get(auth, productDetailes);

// Product Update Route
routerProduct.route("/api/product/:id").put(auth, productUpdate);

// Product Global Search Route
routerProduct.route("/api/search").get(auth, productSearch);


module.exports = routerProduct;
