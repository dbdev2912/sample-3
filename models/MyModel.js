
const { Model } = require('../config/models');
class MyModel extends Model{
    constructor(){
        super("MyModel");
        this.model.__addField__( "MyModel_id", Model.types.number )
        this.model.__addField__( "Model_value", Model.types.string )
        this.model.__addField__( "Model_create_on", Model.types.datetime )
        this.model.__addPrimaryKey__( ["MyModel_id"] )        
    }
}   
    
module.exports = MyModel
    