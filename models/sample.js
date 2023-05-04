
const { Model } = require('../config/models');
class sample extends Model{
    constructor(){
        super("sample");
        this.model.__addField__( "sample_id", Model.types.number )
    
        this.model.__addPrimaryKey__( ["sample_id"] )        
    }
}   
    
module.exports = sample
    