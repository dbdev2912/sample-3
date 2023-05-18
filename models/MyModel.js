
const { Model } = require('../config/models');
class MyModel extends Model{
    constructor(){
        super("mymodel");
        this.__addField__( "MyModel_id", Model.types.int )
    
        this.__addPrimaryKey__( ["MyModel_id"] )        
    }
}   
class MyModelRecord extends MyModel {
    constructor( { id, MyModel_id } ){
        super();
        this.setDefaultValue( { id, MyModel_id } )        
    }

    get = () => {
        return {
            id: this.id.value(),
            MyModel_id: this.MyModel_id.value()
        }
    }
}
module.exports = { MyModel, MyModelRecord }
    