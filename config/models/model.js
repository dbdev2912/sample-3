const Table = require('./table');
const { Number, String, Datetime } = require('./fields');

class Model {
    static types = {
        number: Number,
        string: String,
        datetime: Datetime,
    }
    constructor(modelName){
        this.model = new Table(modelName)
        this.model.__addField__( "id", Model.types.number );
    }

    setDefaultValue = ( serializedData ) => {
        for( let i = 0; i < this.model.__fields.length; i++ ){
            const { __fieldName, __fieldObject } =  this.model.__fields[i]
            this[ __fieldName ] = __fieldObject
            this[ __fieldName ].value( serializedData[ __fieldName ] )
        }
    }

    __addField__ = ( fieldName, fieldObject, fieldProps = undefined ) => {
        this.model.__addField__( fieldName, fieldObject, fieldProps = undefined )
    }

    __addForeignKey__ = ( fieldName, referencesOn ) => {
        this[ new referencesOn().model.__tableName ] = new referencesOn()
        this.model.__addForeignKey__( fieldName, referencesOn )
    }

    __addPrimaryKey__ = ( fields ) => {
        this.model.__addPrimaryKey__(fields);
    }


    find = async ( query = undefined ) => {
        const type = typeof( query );

        switch(type){
            case 'number':
            case 'undefined':
                return await this.model.__find__( query )            
            default:
                return await this.model.__findCriteria__(query)                
        }
    }

    insert = async ( data ) => {
        return await this.model.__insertRecord__( data );
    }

    save = async () => {
        let id = this.id.value();
        if( id ){
            const newData = { id };
            for( let i = 0; i < this.model.__fields.length; i++ ){
                const { __fieldName } =  this.model.__fields[i]
                newData[ __fieldName ] = this[ __fieldName ].value();                
            }
            console.log(newData )
            
        }else{            
            id = await this.model.__getNewId__();
            const newData = { id };

            for( let i = 0; i < this.model.__fields.length; i++ ){
                const { __fieldName } =  this.model.__fields[i]
                newData[ __fieldName ] = this[ __fieldName ].value();                
            }
            let insertResult = await this.model.__insertObject__( newData );
            if( insertResult ){
                this.id.value( id );
                return true
            }
            else{
                return false;
            }
        }       
    }
}


module.exports = Model
