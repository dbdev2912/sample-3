const { Model } = require('../config/models');
const { Customers } = require('./customers');

class Orders extends Model{
    constructor(){
        super("orders");
        this.model.__addField__("order_id", Model.types.number);
        this.model.__addField__("customer_id", Model.types.number);
        this.model.__addField__("create_on", Model.types.datetime, { format: "YYYY/DD/MM" });

        this.model.__addPrimaryKey__(["order_id"]);
        this.model.__addForeignKey__("customer_id", Customers)
    }
}


class Order extends Orders {
    constructor({ id, order_id, customer_id, create_on }){
        super()        
        this.setDefaultValue( { id, order_id, customer_id, create_on } )
    }
    get = () => {
        return {
            id: this.id.value(),
            order_id: this.order_id.value(),
            customer_id: this.customer_id.value(),
            create_on: this.create_on.getFormatedValue()
        }
    }
}

module.exports = { Orders, Order }
