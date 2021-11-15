const express = require("express");
const cors = require("cors");
var logger = require('morgan')
const fs = require("fs");
const app = express();
var glob = require("glob")

var corsOptions = {
  origin: "http://localhost:8081"
};
const fileUpload = require('express-fileupload');

app.use(fileUpload());
app.use(logger('dev'));
app.use(cors(corsOptions));
app.set('views', __dirname + "/views");
app.set('view engine', 'ejs')
app.use(express.static('public'))


// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));


// simple route
app.get("/", (req, res) => {
    res.render("index", {
        title: "Xác thực thu chi"
    });
});

app.get("/list", (req, res)=>{
    var path = require('path');

    const directoryPath = path.join(__dirname, '/data');
    //passsing directoryPath and callback function
    fs.readdir(directoryPath, function (err, files) {
        //handling error
        if (err) {
            return console.log('Unable to scan directory: ' + err);
        } 
        //listing all files using forEach
        files.forEach(function (file) {
            // Do whatever you want to do with the file
            console.log(file); 
        });
        res.render("list", {
            files: files
        });
    });
})

app.get("/setup", function(req, res){
    let jsonData = require('./config/setup.json');
    console.log(jsonData);
    res.render("setup.ejs", {
        title: "Setup file",
        data: jsonData
    })
});
var kConfig = ["fromRow", "toRow", "headRow", "brandName", "productNameColumn", "productPriceColumn"];
app.post("/save", (req, res)=>{
    console.log(req.body);
    let jsonData = require('./config/setup.json');
    var check = false;
    var config = {
        "fromRow": req.body.fromRow,
        "toRow": req.body.toRow,
        "headRow": req.body.headRow,
        "brandName": req.body.brandName,
        "productNameColumn": req.body.productNameColumn,
        "productPriceColumn": req.body.productPriceColumn
    }
    jsonData.forEach(function(e){
        if((e.nameFile == req.body.nameFile) && (e.nameSheet == req.body.nameSheet)){
            e.config = config;
            check = true;
        }
    })
    if(check == false){
        jsonData.push({
            nameFile: req.body.nameFile,
            nameSheet: req.body.nameSheet,
            config: config
        })
    }
    fs.writeFileSync('./config/setup.json', JSON.stringify(jsonData));
    console.log("THU NGHIEM", req.body);
    if(req.body.url){
        res.redirect(req.body.url);
    } else {
        res.redirect("/list");
    }
})
app.get("/delconfig/file/:name/:page", (req, res)=>{
    var path = require('path');
    path = __dirname + "/data/" + req.params.name;
    var xlsx = require('node-xlsx');
    var obj = xlsx.parse(path); // parses a file  
    let jsonData = require('./config/setup.json');
    var temp = -1;
    jsonData.forEach(function(e, i){
        if((e.nameFile == req.params.name) && (e.nameSheet == obj[req.params.page].name)){
            temp = i;
        }
    })
    if(temp >= 0){
        jsonData.splice(temp, 1);
    }
    console.log(jsonData);
    fs.writeFileSync('./config/setup.json', JSON.stringify(jsonData));
    res.redirect(req.originalUrl.split("/delconfig")[1]);
});

app.get("/file/:name/:page", (req, res)=>{
    console.log(req.params)
    const fs = require("fs");
    var path = require('path');
    path = __dirname + "/data/" + req.params.name;
    var xlsx = require('node-xlsx');
    var obj = xlsx.parse(path); // parses a file  
    console.log(req.originalUrl);
    if(req.params.page == undefined){
        req.params.page = 0;
    }
    let jsonData = require('./config/setup.json');
    var config = {}
    console.log(obj[req.params.page].name);
    jsonData.forEach(function(e){
        if((e.nameFile == req.params.name) && (e.nameSheet == obj[req.params.page].name)){
            config = e.config;
        }
    })
    console.log("CONF", config);
    kConfig.forEach(function(key){
        if(config[key] == undefined){
            if(key == "headRow"){
                config[key] = 0;
            } else {
                config[key] = "";
            }
        }
    })
    console.log(config);
    res.render("show", {
        obj: obj,
        page: req.params.page,
        url: "/file/" + req.params.name,
        config: config,
        name: req.params.name
    });  
})
app.get("/products", function(req, res){
    d = require("./createData");
    res.render("products", {
        data: d.products,
        title: "Danh sách sản phẩm"
    })
})
app.post('/file_upload', function (req, res) {
    let sampleFile;
    let uploadPath;

    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No files were uploaded.');
    }
    sampleFile = req.files.file;
    uploadPath = __dirname + '/data/' + sampleFile.name;
    sampleFile.mv(uploadPath, function(err) {
        if (err)
        return res.status(500).send(err);
        data = acb.parse(uploadPath);
        res.json(data);
        fs.unlinkSync(uploadPath);
    });
})
require("./route/sheet")(app);
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});