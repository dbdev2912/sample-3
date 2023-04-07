const { Varchar, Int, Text } = require("../../database");
const Customers = require('../tables/customers');

class Customer extends Customers {
    constructor( { id, customer_id, customer_name, address, date_of_birth } ){
        super();
        this.id.value(id)
        this.customer_id.value(customer_id)
        this.customer_name.value( customer_name )
        this.address.value(address)
        this.date_of_birth.value(date_of_birth)
    }
    get = () => {
        const data = {
            id: this.id.value(),
            customer_id:    this.customer_id.value(),
            customer_name:  this.customer_name.value(),
            address:        this.address.value(),
            date_of_birth:  this.date_of_birth.value()
        }
        if( !this.id.value() ){
            delete data.id
        }
        return data;
    }

    set = (customer) => {
        const { customer_id, customer_name, address } = customer
        this.customer_id.value(customer_id)
        this.customer_name.value( customer_name )
        this.address.value(address)
    }


    setCustomerName = ( customer_name ) => {
        this.customer_name.value(customer_name)
    }

    saveCustomer = async () => {
        await this.save()
    }

    deleteCustomer = async () => {
        await this.remove()
    }
}


module.exports = Customer
