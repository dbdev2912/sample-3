
const { Model } = require('../config/models');
class _ extends Model{
    constructor(){
        super("_");
        this.model.__addField__( "__id", Model.types.number )
    
        this.model.__addPrimaryKey__( ["__id"] )        
    }
}   
    
module.exports = _
    