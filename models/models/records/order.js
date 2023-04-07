const { Varchar, Int, Text } = require("../../database");
const Orders = require('../tables/Orders');

class Order extends Orders {
    constructor( { id, order_id, customer_id, order_date, description } ){
        super()
        this.id.value(id);
        this.order_id.value(order_id);
        this.customer_id.value(customer_id);
        this.order_date.value(order_date);
        this.description.value(description);
    }
}
