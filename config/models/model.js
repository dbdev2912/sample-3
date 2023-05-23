const Table = require('./table');
const { Number, String, Datetime, Int, Bool, Enum } = require('./fields');

class Model {
    static types = {
        number:     Number,
        int:        Int,
        string:     String,
        datetime:   Datetime,
        bool:       Bool,
        enum:       Enum
    }
    #model = undefined;

    constructor(modelName){
        this.#model = new Table(modelName)
        this.#model.__addField__( "id", Model.types.int, { required: false } );
    }

    getModel = () => {
        return this.#model
    }

    setDefaultValue = ( serializedData ) => {
        const fields = this.#model.__getFields__()
        for( let i = 0; i < fields.length; i++ ){
            const { __fieldName, __fieldObject } =  fields[i]
            this[ __fieldName ] = __fieldObject
            this[ __fieldName ].value( serializedData[ __fieldName ] )
        }
    }

    __addField__ = ( fieldName, fieldObject, fieldProps = undefined ) => {
        this.#model.__addField__( fieldName, fieldObject, fieldProps )
    }

    __addForeignKey__ = ( fieldName, referencesOn, onField = undefined ) => {
        this[ new referencesOn().getModel().__getTableName__() ] = new referencesOn().getModel()
        this.#model.__addForeignKey__( fieldName, referencesOn, onField )
    }

    __addPrimaryKey__ = ( fields ) => {
        this.#model.__addPrimaryKey__(fields);
    }


    find = async ( query = undefined ) => {
        const type = typeof( query );

        switch(type){
            case 'number':
            case 'undefined':
                return await this.#model.__find__( query )
            default:
                return await this.#model.__findCriteria__(query)
        }
    }

    insert = async ( data ) => {
        return await this.#model.__insertRecord__( data );
    }

    save = async () => {
        let id = this.id.value();
        if( id ){
            const newData = { id };
            const fields = this.#model.__getFields__()
            for( let i = 0; i < fields.length; i++ ){
                const { __fieldName } =  fields[i]
                const required = this[ __fieldName ].__required;
                if( required && this[ __fieldName ].value() == undefined ){
                    throw Error(`${this.#model.__getTableName__()}.${__fieldName} mang thuộc tính required = true nên không được phép bỏ trống!`)
                }
                newData[ __fieldName ] = this[ __fieldName ].value();
            }
            const updateResult = await this.#model.__updateObject__( {...newData} );
            return updateResult;

        }else{
            id = await this.#model.__getNewId__();
            const newData = {};
            const fields = this.#model.__getFields__()

            for( let i = 0; i < fields.length; i++ ){
                const { __fieldName } =  fields[i]
                const required = this[ __fieldName ].__required;
                if( required && this[ __fieldName ].value() == undefined ){
                    throw Error(`${this.#model.__getTableName__()}.${__fieldName} mang thuộc tính required = true nên không được phép bỏ trống!`)
                }

                newData[ __fieldName ] = this[ __fieldName ].value();
            }

            newData.id = id;
            let insertResult = await this.#model.__insertObject__( newData );
            if( insertResult ){
                this.id.value( id );
                return true
            }
            else{
                return false;
            }
        }
    }

    remove = async () => {
        const id = this.id.value();
        await this.#model.__deleteObject__({ id })
    }

}


module.exports = Model
