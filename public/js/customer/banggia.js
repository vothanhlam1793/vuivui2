var app_customer = new Vue({
    el: "#app", 
    data: {
        // data using
        products: [],
        inputSearch: "",

        // function handler
        onSearchHandler: function(){},
        addItem: function(){},
        deleteItem: function(){},
        checkItem: function(){},
    },
    methods: {
        drawTable: function(products){
            this.products = products;
        },
        bindSearchProduct: function(handler){
            this.onSearchHandler = handler;
        },
        bindAddItem: function(handler){
            this.addItem = handler;
        },
        getColor: function(type){
            if(type == "KHUYENMAI"){
                return "table-danger"
            }
        },
        numberWithCommas: function (x) {
            return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        }
        
    },
    created: function(){

    }
});

class ControllerProduct{
    constructor(view, model){
        this.view = view;
        this.model = model;
        this.model.bindProductsChanged(this.onProductChanged);
        this.view.bindSearchProduct(this.handlerInputSearch);
    }
    onProductChanged = products => {
        this.view.drawTable(products);
    }
    handlerInputSearch = inputSearch => {
        this.model.searchProduct(inputSearch);
    }
}

class ControllerCart{
    constructor(view, model){
        this.view = view;
        this.model = model;
        this.view.addItem = this.handlerAddItem;
        this.view.checkItem = this.handlerCheckItem;
        this.view.deleteItem = this.handlerDeleteItem;
        this.model.bindCartChanged(this.onCartChanged);
    }
    onCartChanged = () => {
        this.view.$forceUpdate();
    }
    handlerAddItem = product => {
        this.model.addItem(product);
    }
    handlerCheckItem = product => {
        return this.model.checkItem(product);
    }
    handlerDeleteItem = product => {
        this.model.deleteItem(product);
    }
}


var app_cart_mini = new Vue({
    el: "#cart",
    data: {
        
    }
})

var appProduct = new ControllerProduct(app_customer, new Product());
var appCart = new ControllerCart(app_customer, new Cart())