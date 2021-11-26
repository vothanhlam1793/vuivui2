
exports.getProducts = async (req, res) => {
    var data = [];
    // Get data from Sheet
    data = await getProducts();

    // Get data from file excel
    var temp = require("../createData").products;
    temp = temp.map(function(e){
        return {
            name: e.productNameColumn,
            price: e.cap3,
            type: "CAMERA"
        };
    });

    // Concat 2 du lieu lai voi nhau
    data = data.concat(temp);
    res.send(data);
}