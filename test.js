var url= "https://script.google.com/macros/s/AKfycbxpn0Yxexari6sRTbBrfQD6l619IjqjmOLSx8tQRze0Dv91z6gHz6HX2D5Zw8vz5I3Y/exec?sheetName=BANGGIA";
var fetch = require("node-fetch");
var t1 = new Date();
fetch(url).then(res=>res.json()).then(j=>{
    console.log(j)
    console.log((- t1.getTime() + (new Date()).getTime())/1000, "s");
})