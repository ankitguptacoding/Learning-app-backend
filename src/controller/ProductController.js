const Product = require('../models/Product');
const mongoose = require('mongoose');
var _ = require('lodash');

module.exports = {
    
    productAdd: async (req, res) => {

        let response = { "data": [], "status": false, "message": "" };
        const { name, price, category, userId, company } = req.body;

        console.log(name, price, category, userId, company);
        if (!_.isEmpty(name) && !_.isEmpty(price) && !_.isEmpty(category) && !_.isEmpty(userId) && !_.isEmpty(company)) {

            let product = new Product(req.body);
            let result = await product.save();
            response.data = result;
            response.status = true;
            response.message = "sucessfully Product Add"
            res.send(response);
            return;
        }
        delete response.data;
        response.message = "Empty Fields"
        res.send(response);
        return;

    },

    productList: async (req, res) => {

        let response = { "data": [], "status": false, "message": "" };
        let products = await Product.find();
        if (products.length > 0) {
            response.data = products;
            response.status = true;
            response.message = "Product List"
            res.send(response);
            return;
        }
        delete response.data;
        response.message = "No Products Found"
        res.send(response);
        return;
    },

    productDelete: async (req, res) => {
        let id = req.params.id;
        let response = { "status": false, "message": "" };
        console.log("id", id);
        const result = await Product.deleteOne({ _id: id });
        if (result.deletedCount > 0) {
            response.status = true;
            response.message = "Product deleted."
            res.send(response);
            return;
        }
        response.status = false;
        response.message = "Product Already Deleted"
        res.send(response);
        return;
    },

    productDetailes: async (req, res) => {
        try {

            let id = req.params.id;
            let response = { "data": [], "status": false, "message": "" };
            if (!mongoose.Types.ObjectId.isValid(id)) {
                delete response.data;
                response.message = "Wrong Product Id ."
                res.send(response);
                return;
            }
            else {
                const products = await Product.findOne({ _id: id });
                response.data = products;
                response.status = true;
                response.message = "Product detailes."
                res.send(response);
                return;
            }
        } catch (error) {
            console.log(error);
        }
    },

    productUpdate: async (req, res) => {
        try {

            let id = req.params.id;
            let response = { "data": [], "status": false, "message": "" };
            if (!mongoose.Types.ObjectId.isValid(id)) {
                delete response.data;
                response.message = "Wrong Product Id ."
                res.send(response);
                return;
            }
            else {
                const products = await Product.updateOne({ _id: id }, {
                    $set: req.body
                });
                response.data = products;
                if (products.modifiedCount > 0) {
                    response.data = products;
                    response.status = true;
                    response.message = "Product updated."
                    res.send(response);
                    return;
                } else {
                    response.status = false;
                    response.message = "Product Already updated."
                    res.send(response);
                    return;
                }



            }
        } catch (error) {
            console.log(error);
        }
    },

    productSearch: async (req, res) => {
        try {

            let key = req.query.key;
            let type = req.query.type;
            let fields = {};
            let response = { "data": [], "status": false, "message": "" };
            if (type == undefined && key != undefined) {
                const products = await Product.find({
                    "$or": [
                        { name: { $regex: key, $options: 'i' } },
                        { company: { $regex: key, $options: 'i' } },
                        { category: { $regex: key, $options: 'i' } },
                        { price: { $regex: key, $options: 'i' } },
                    ]
                });
                response.data = products;
                response.status = true;
                response.message = "Product detailes."
            } else {

                let query = {};

                if (key == undefined) {
                    if (type != undefined) {

                        fields = { [type]: 1 }
                    }

                } else {

                    query = {
                        "$or": [
                            {
                                [type]: { $regex: key, $options: 'i' }
                            }

                        ]
                    }
                }

                const products = await Product.find(query, fields);
                console.log("product", products);
                response.data = products;
                response.status = true;
                response.message = "Product detailes."
            }

            res.send(response);
            return;

        } catch (error) {
            console.log(error);
        }


    }
}