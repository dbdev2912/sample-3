const { Varchar, Int, Text, Table, DateTime } = require("../../database");

class Customers extends Table {
    constructor(){
        super( "customer" );
        this.id = new Int("id") /* Important! */
        this.customer_id   = new Int("customer_id")
        this.customer_name = new Varchar("customer_name", 255)
        this.address       = new Text("address");
        this.date_of_birth = new DateTime("date_of_birth")

        this.primaryKey( ["customer_id"] )
        this.tableFields(["customer_id", "customer_name", "address", "date_of_birth"])

        this.customer_id.primaryTo([
            {
                table: "orders",
                field: "customer_id"
            }
        ])
    }
    getCustomers = async () => {
        const data = await this.find();
        return data;
    }
    getCustomer = async ( customer_id ) => {
        const data = await this.find({ customer_id });
        return data;
    }
}


module.exports = Customers
