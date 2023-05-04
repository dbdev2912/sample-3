
const { Model } = require('../config/models');
class model_moi extends Model{
    constructor(){
        super("model_moi");
        this.model.__addField__( "model_moi_id", Model.types.number )
        this.model.__addField__( "value_gi_do", Model.types.string )
        this.model.__addPrimaryKey__( ["model_moi_id"] )        
    }
}   
    
module.exports = model_moi
    