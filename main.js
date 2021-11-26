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

require("./route/customer")(app);
// require("./route/sheet")(app);
app.get('*', function(req, res){
  res.render("customer/index", {
    title: "Bảng giá phụ kiện"
  })
});

const PORT = process.env.PORT || 8080;
app.listen(PORT,() => {
    console.log(`Server is running on port ${PORT}.`);
});