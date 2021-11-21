var url= "https://script.google.com/macros/s/AKfycbxpn0Yxexari6sRTbBrfQD6l619IjqjmOLSx8tQRze0Dv91z6gHz6HX2D5Zw8vz5I3Y/exec";
var fetch = require("node-fetch");
var objProduct = {
    date: new Date("2000-01-01"),
    data: []
}
var Products = {
    data: []
};

async function getProducts(pNew){
    if(pNew == 1){
        var j = await getSheetData(url + "?sheetName=BANGGIA", 1);
        Products.data = Products.data.concat(j.map(function(e){
            return {
                name: e.name,
                price: e.price_3,
                type: "PHUKIEN"
            }
        }))
        var k = await getSheetData(url + "?sheetName=KHUYENMAICAM", 1);
        Products.data = Products.data.concat(k.map(function(e){
            return {
                name: e.name,
                price: e.price_3,
                type: "KHUYENMAI"
            }
        }))
        console.log("DONE - update data", k.length, j.length);
    } else {
        return Products.data;
    }
}

async function getSheetData(pUrl, pNew){
    var t1 = new Date();
    var vNew = pNew;
    if(((new Date()).getTime() - objProduct.date.getTime()) > 86400*1000){
        vNew = 1;   
    }
    if(vNew == 1){
        var res = await fetch(pUrl);
        var j = await res.json();
        objProduct.date = new Date();
        objProduct.data = j;
    }
    return objProduct.data;
}

module.exports = async app => {
    var router = require("express").Router(); 
    // router.get("/", (req, res)=>{
    //     d = require("../createData");
    //     res.render("customer/customer", {
    //         title: "Xem nhanh bảng gía",
    //         data: d.products,
    //         message: ""
    //     })
    // })
    router.get("/", (req, res)=>{
        res.render("customer/index", {
            title: "MVC"
        })
    })
    router.get("/cart", (req, res)=>{
        res.render("customer/cart", {
            title: "Giỏ hàng"
        })
    })
    router.get("/data", async (req, res) => {
        var data = [];
        data = await getProducts();
        var temp = require("../createData").products;
        data = data.concat(temp.map(function(e){
            return {
                name: e.productNameColumn,
                price: e.cap3,
                type: "CAMERA"
            };
        }));
        res.send(data);
    })
    router.get("/renew", async function(req, res){
        await getProducts(1);
        res.send({
            message: "OK"
        })
    })
    require("../createData");
    getProducts(1);
    app.use("/customer", router);
}