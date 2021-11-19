module.exports = app => {
    var router = require("express").Router(); 
    router.get("/", (req, res)=>{
        d = require("../createData");
        res.render("customer/customer", {
            title: "Xem nhanh bảng gía",
            data: d.products,
            message: ""
        })
    })
    app.use("/customer", router);
}