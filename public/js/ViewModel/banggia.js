function chuyentiengviet(str) {
    return str.normalize('NFD')
              .replace(/[\u0300-\u036f]/g, '')
              .replace(/đ/g, 'd').replace(/Đ/g, 'D');
  }
function VMBanggia(el, mix){
    return new Vue({
        el: el,
        mixins: [mix],
        data: {
            // data using
            products: [],               // Using show
            inputSearch: "",            // Using with search
            productsOriginal: [],       // Using origin
        
        },
        methods: {
            // comment process data
            onInputSeach: function(){
                var changeSearchReg = chuyentiengviet(this.inputSearch).split(" ").join("[ -w]+");
                var reg = new RegExp(changeSearchReg, "i");
                this.products = this.productsOriginal.filter(function(e){
                    var temp = [e.name, e.sheet, e.branch];
                    return reg.test(chuyentiengviet(temp.join(" ")));
                });
            },
            // function support view basic
            numberWithCommas: function (x) {
                return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
            },
        },
        // Init data when startup application
        created: function(){
            var that = this;
            // Get data when init
            $.get("/data", function(data){
                // console.log(data);
                that.products = data.slice();
                that.productsOriginal = data.slice();
            })
        }
    })
}