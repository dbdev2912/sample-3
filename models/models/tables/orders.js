const { Varchar, Int, Text, Table, DateTime } = require("../../database");

class Orders extends Table {
    constructor(){
        super( "orders" );
        this.id = new Int("id")
        this.order_id = new Int("order_id")
        this.customer_id = new Int("customer_id");
        this.order_date = new DateTime("order_date")
        this.description = new Text("description")

        this.tableFields([ "id", "order_id", "order_date", "description" ])
        this.primaryKey([ order_id ])
        this.customer_id.foreignKey("customer", "customer_id")
    }
}

module.exports = Orders;
