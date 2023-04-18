const { Model } = require('../config/models');

class Customers extends Model{
    constructor(){
        super("customers");
        this.model.__addField__( "customer_id", Model.types.number )
        this.model.__addField__( "customer_name", Model.types.string )
        this.model.__addField__( "date_of_birth", Model.types.datetime )

        this.model.__addPrimaryKey__( ["customer_id"] )        
    }
}


module.exports = Customers
