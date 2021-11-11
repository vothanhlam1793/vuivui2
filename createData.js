var xlsx = require('node-xlsx');
let jsonData = require('./config/setup.json');
// console.log(jsonData);
var data = [];
var o = {
    productNameColumn: 0,
    productPriceColumn: 0
}
jsonData.forEach(function(file){
    var path = require('path');
    path = __dirname + "/data/" + file.nameFile;
    var obj = xlsx.parse(path); // parses a file  
    temp = obj.filter(function(e){
        return e.name == file.nameSheet;
    })
    console.log(temp[0].data[file.config.headRow]);
    // var nColumn = 0;
    var pColumn = 0;
    try {
        temp[0].data[file.config.headRow].forEach(function(e, i){
            console.log(e);
            if(e.split("\r\n").join("") == file.config.productNameColumn.split("\r\n").join("")){
                nColumn = i;
            }
            if(e.split("\r\n").join("") == file.config.productPriceColumn.split("\r\n").join("")){
                pColumn = i;
            }
        })
    } catch (e) {

    }
    console.log(nColumn, pColumn);
    // console.log("COUNTER:", file.config.fromRow, file.config.toRow)
    for(var i = parseInt(file.config.fromRow); i <= parseInt(file.config.toRow); i++){
        var cap1 = 0;
        var cap2 = 0;
        var cap3 = 0;        
        var regularPrice = 0;
        try {
            regularPrice = temp[0].data[i][pColumn];
        } catch (e) {

        }
            switch(file.config.brandName){
                case "DAHUA": {
                    if(typeof regularPrice == "number"){
                        cap1 = Math.round(regularPrice*0.5*0.75/1000)*1000;
                        cap2 = Math.round(regularPrice*0.5*0.77/1000)*1000;
                        cap3 = Math.round(regularPrice*0.5*0.79/1000)*1000;
                    }
                } break;
                case "HIKVISION": {
                    if(typeof regularPrice == "number"){
                        cap1 = Math.round(regularPrice*0.6*0.70/1000)*1000;
                        cap2 = Math.round(regularPrice*0.6*0.72/1000)*1000;
                        cap3 = Math.round(regularPrice*0.6*0.74/1000)*1000;
                    }
                } break;
                case "KBVISION": {
                    if(typeof regularPrice == "number"){
                        cap1 = Math.round(regularPrice*0.5*0.76/1000)*1000;
                        cap2 = Math.round(regularPrice*0.5*0.78/1000)*1000;
                        cap3 = Math.round(regularPrice*0.5*0.80/1000)*1000;
                    }
                }
            }
        // } catch (e){

        // }

        try {
            data.push({
                productNameColumn: temp[0].data[i][nColumn],
                productPriceColumn: temp[0].data[i][pColumn],
                cap1: cap1,
                cap2: cap2,
                cap3: cap3
            })
        } catch (f) {

        }
    }
})
data = data.filter(function(e){
    return (e.productNameColumn != undefined) && (e.productPriceColumn != undefined);
})
// console.log(data.length);
module.exports.products = data;