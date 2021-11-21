class Cart {
    constructor(){
        this.items = JSON.parse(localStorage.getItem('items')) || [];
        // this.onCartChanged(this.items);
    }
    bindCartChanged(callback){
        this.onCartChanged = callback;
    }
    _commit(items) {
        this.onCartChanged(items)
        localStorage.setItem('items', JSON.stringify(items))
    }
    addItem(item){
        var index = this.items.findIndex(function(e){
            return e.name == item.name;
        });
        if(index >= 0){

        } else {
            this.items.push({
                name: item.name,
                price: item.price,
                amount: 1
            });
        }
        this._commit(this.items);
    }

    deleteItem(item){
        this.items = this.items.filter(function(e){
            return e.name != item.name;
        })
        this._commit(this.items);
    }
    updateItem(item){
        this.items.forEach(function(e){
            if(e.name == item.name){
                e.amount = item.amount;
            }
        })
        this._commit(this.items);
    }
    checkItem(item){
        var index = this.items.findIndex(function(e){
            return e.name == item.name;
        });
        return index;
    }
}

class Product {
    constructor(){
        this.products = [];
        var that = this;
        $.get("/data", function(data){
            that.products = data;
            that.onProductChanged(that.products);
        })
    }
    bindProductsChanged(callback){
        this.onProductChanged = callback;
    }
    searchProduct(inputSearch){
        var changeSearchReg = inputSearch.split(" ").join("[ -w]+");
        var reg = new RegExp(changeSearchReg, "img");
        var temp = this.products.filter(function(e){
            return reg.test(e.name);
        });
        this.onProductChanged(temp);
    }
}