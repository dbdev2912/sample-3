const { Model } = require('../config/models');
const Customers = require('./customers');

class Orders extends Model{
    constructor(){
        super("orders");
        this.model.__addField__("order_id", Model.types.number);
        this.model.__addField__("customer_id", Model.types.number);
        this.model.__addField__("create_on", Model.types.datetime);

        this.model.__addPrimaryKey__(["order_id"]);
        this.model.__addForeignKey__("customer_id", Customers)
    }
}

module.exports = Orders
