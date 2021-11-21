var app_cart = new Vue({
    el: "#app",
    data: {
        items: [],
        deleteItem: function(){},
    },
    methods: {
        numberWithCommas: function (x) {
            return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        }
    },
    created: function() {

    }
})

class ControllerCart{
    constructor(view, model){
        this.view = view;
        this.model = model;
        this.model.bindCartChanged(this.onCartChanged);

        // Init funciton
        this.view.deleteItem = this.handlerDeleteItem;
        // Init data begin
        this.onCartChanged(this.model.items);
    }
    onCartChanged = items => {
        this.view.items = items;
    }
    handlerDeleteItem = item => {
        this.model.deleteItem(item);
    }
}

var app = new ControllerCart(app_cart, new Cart())