
const { Model } = require('../config/models');
class mo_do_moi_ne extends Model{
    constructor(){
        super("mo_do_moi_ne");
        this.model.__addField__( "mo_do_moi_ne_id", Model.types.number )
    
        this.model.__addPrimaryKey__( ["mo_do_moi_ne_id"] )        
    }
}   
    
module.exports = mo_do_moi_ne
    