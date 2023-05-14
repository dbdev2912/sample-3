const { Model } = require('../config/models');

class Customers extends Model{
    constructor(){
        super("customers");
        this.__addField__( "customer_id", Model.types.int, { required: true } )
        this.__addField__( "customer_name", Model.types.string, { maxLength: 255,  required: true } )
        this.__addField__( "date_of_birth", Model.types.datetime,{ required: true } ) 
        this.__addField__( "gender", Model.types.bool, { default: true } )       
        this.__addPrimaryKey__( ["customer_id"] )        
    }
}

class Customer extends Customers {
    constructor( { id, customer_id, customer_name, date_of_birth, gender } ){
        super();
        this.setDefaultValue( { id, customer_id, customer_name, date_of_birth, gender } )        
    }

    get = () => {
        return {
            id: this.id.value(),
            customer_id: this.customer_id.value(),
            customer_name: this.customer_name.value(),
            date_of_birth: this.date_of_birth.value(),
            gender: this.gender.value() ? "Nam" : "Nữ"
        }
    }
}


module.exports = { Customers, Customer }
