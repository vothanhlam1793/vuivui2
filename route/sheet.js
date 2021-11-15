var url= "https://script.google.com/macros/s/AKfycbxpn0Yxexari6sRTbBrfQD6l619IjqjmOLSx8tQRze0Dv91z6gHz6HX2D5Zw8vz5I3Y/exec";
var fetch = require("node-fetch");

var objProduct = {
    date: new Date("2000-01-01"),
    data: []
}
var objKhuyenmai = {
    date: new Date("2000-01-01"),
    data: []
}

module.exports = app => {
    var router = require("express").Router();
    router.get("/", (req, res) => {
        var t1 = new Date();
        if(((new Date()).getTime() - objProduct.date.getTime()) > 86400*1000){
            req.query.new = 1;    
        }
        if(req.query.new){
            fetch(url + "?sheetName=BANGGIA").then(res=>res.json()).then(j=>{
                objProduct.date = new Date();
                objProduct.data = j;
                res.render("sheet/index", {
                    title: "Giá bán lẻ",
                    data: objProduct.data,
                    url: req.originalUrl
                })
                console.log((- t1.getTime() + (new Date()).getTime())/1000, "s");
            })
        } else {
            res.render("sheet/index", {
                title: "Giá bán lẻ",
                data: objProduct.data,
                url: req.originalUrl
            })
        }
    })
    router.get("/khuyenmai", (req, res) => {
        var t1 = new Date();
        if(((new Date()).getTime() - objKhuyenmai.date.getTime()) > 86400*1000){
            req.query.new = 1;    
        }
        if(req.query.new){
            fetch(url + "?sheetName=KHUYENMAICAM").then(res=>res.json()).then(j=>{
                objKhuyenmai.date = new Date();
                objKhuyenmai.data = j;
                res.render("sheet/khuyenmai", {
                    title: "Khuyến mãi camera tháng",
                    data: objKhuyenmai.data,
                    url: req.originalUrl
                })
                console.log((- t1.getTime() + (new Date()).getTime())/1000, "s");
            })
        } else {
            res.render("sheet/khuyenmai", {
                title: "Khuyến mãi camera tháng",
                data: objKhuyenmai.data,
                url: req.originalUrl
            })
        }
    })
    app.use("/sheet", router);
}