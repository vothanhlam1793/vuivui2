var t1 = new Date();
data = parseVietcombank(__dirname + "/data/DSSMN-BaoGia Dahua T11-2021 (1).xlsx");
console.log("Total:", data.length);
console.log("Time parse:", ((new Date()).getTime() - t1.getTime())/1000, "s");
function parseVietcombank(path){
    var xlsx = require('node-xlsx');
    var obj = xlsx.parse(path); // parses a file    
    data = obj[0].data;
    data = data.filter(function(e){
        if(e.length != 5){
            return false;
        } else {
            try {
                if(e[0].length == 10){
                    return true;
                }
            } catch (e) {
                return false;
            }
    
        }
    })
    function transDate(d){
        var obj = d.split("/");
        var str = obj[2] + "-" + obj[1] + "-" + obj[0];
        return obj.join("/");
    }
    function parseMoney(d, s){
        if(s == "+"){
            return parseInt(d.split(",").join(""));
        } else {
            return parseInt("-" + d.split(",").join(""));
        }
    
    }
    
    var form = {
        date: "",
        code: "",
        amount: "",
        content: "",
        bank: ""
    }
    
    dataDone = [];
    data.forEach(function(e){
        dataDone.push({
            date: transDate(e[0]),
            code: e[1],
            amount: parseMoney(e[3], e[2]),
            content: e[4],
            bank: "VCB"
        })
    })
    return dataDone;
}

module.exports.parse = parseVietcombank