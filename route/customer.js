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
        Products.data = [];
        var j = await getSheetData(url + "?sheetName=BANGGIA", 1);
        Products.data = Products.data.concat(j.map(function(e){
            return {
                name: e.name,
                price: e.price_3,
                price_2: e.price_2,
                price_1: e.price_1,
                type: "PHUKIEN",
                branch: "Phụ kiện camera",
                sheet: e.group || ""
            }
        }))
        var k = await getSheetData(url + "?sheetName=KHUYENMAICAM", 1);
        Products.data = Products.data.concat(k.map(function(e){
            return {
                name: e.name,
                price: e.price_3,
                price_2: e.price_2,
                price_1: e.price_1,
                type: "Khuyến mãi",
                branch: e.branch || "",
                sheet: e.group || ""
            }
        }))

        var l = await getSheetData(url + "?sheetName=CAMERAWIFI", 1);
        Products.data = Products.data.concat(l.map(function(e){
            return {
                name: e.name,
                price: e.price_3,
                price_2: e.price_2,
                price_1: e.price_1,
                type: "Camera Wifi",
                branch: e.branch || "",
                sheet: e.group || ""
            }
        }))
        console.log("DONE - update data", k.length, j.length, l.length);
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

    router.get("/", (req, res)=>{
        res.render("customer/index", {
            title: "Bảng giá phụ kiện"
        })
    })
    router.get("/cart", (req, res)=>{
        res.render("customer/cart", {
            title: "Giỏ hàng"
        })
    })
    router.get("/info", (req, res)=>{
        res.render("customer/info", {
            title: "Liên hệ"
        })
    })
    router.get("/howtobuy", (req, res)=>{
        res.render("customer/howtobuy", {
            title: "Liên hệ"
        })
    })

    router.get("/data", async (req, res) => {
        var data = [];
        // Get data from Sheet
        data = await getProducts();

        // Get data from file excel
        var temp = require("../createData").products;
        temp = temp.map(function(e){
            return {
                name: e.productNameColumn,
                price: e.cap3,
                price_2: e.cap2,
                price_1: e.cap1,
                type: "CATALOG",
                branch: e.branch,
                sheet: e.sheet
            };
        });

        // Concat 2 du lieu lai voi nhau
        data = data.concat(temp);
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
    app.use("/", router);
}