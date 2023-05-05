const { Model } = require('../config/models');

class Customers extends Model{
    constructor(){
        super("customers");
        this.__addField__( "customer_id", Model.types.number )
        this.__addField__( "customer_name", Model.types.string, { maxLength: 255 } )
        this.__addField__( "date_of_birth", Model.types.datetime )        
        this.__addPrimaryKey__( ["customer_id"] )        
    }
}

class Customer extends Customers {
    constructor( { id, customer_id, customer_name, date_of_birth } ){
        super();
        this.setDefaultValue( { id, customer_id, customer_name, date_of_birth } )        
    }

    get = () => {
        return {
            id: this.id.value(),
            customer_id: this.customer_id.value(),
            customer_name: this.customer_name.value(),
            date_of_birth: this.date_of_birth.value()
        }
    }
}


module.exports = { Customers, Customer }
