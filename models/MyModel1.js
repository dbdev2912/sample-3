
const { Model } = require('../config/models');
class MyModel1 extends Model{
    constructor(){
        super("MyModel1");
        this.model.__addField__( "MyModel1_id", Model.types.number )
        this.model.__addField__( "value", Model.types.string )
        this.model.__addPrimaryKey__( ["MyModel1_id"] )        
    }
}   
    
module.exports = MyModel1
    