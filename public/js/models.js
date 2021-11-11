var Transaction = Backbone.Model.extend({
    urlRoot: '/api/transactions',
    idAttribute: "_id"
});
var Transactions = Backbone.Collection.extend({
    urlRoot: '/api/transactions',
    idAttribute: "_id"
});