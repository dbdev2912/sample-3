const { Database } = require("./database");

class Table {
    static __tableName;
    #dbo = new Database();

    constructor( name ){
        this.__tableName = name;
        this.__fields = [];
        this.__foreignKeys = [];
        this.__primaryKey = [];        
    };

    __dbInit__ = async () => {
        await this.#dbo.init()
    }

    __getNewId__ = async () => {
        await this.__dbInit__();
        const id = await this.#dbo.getAutoIncrementId( this.__tableName );
        return id;
    }

    __setFields__ = (fields) => {
        this.__fields = fields;
    }

    __isFieldExisted__ = ( fieldName ) => {
        const field = this.__fields.filter( f => f.__fieldName == fieldName )[0];
        return field != undefined ? true : false
    }

    __addField__ = ( fieldName, fieldObject, fieldProps = undefined ) => {
        if( !this.__isFieldExisted__( fieldName ) ){
            this[fieldName] = new fieldObject( fieldName );
            this.__fields.push({ __fieldName: fieldName, __fieldObject: new fieldObject( fieldName, undefined, fieldProps ) })
        }
    }

    __addForeignKey__ = ( fieldName, referencesOn ) => {
        const ObjReferencesOn = new referencesOn()
        const __tableName = ObjReferencesOn.model.__tableName;
        this[ __tableName ] = ObjReferencesOn;
        this.__foreignKeys.push({ __fieldName: fieldName, __tableName });
    }

    __addPrimaryKey__ = ( fields ) => {
        this.__primaryKey.push([ ...fields ])
    }

    __primaryKeyCheck__ = async (data) => {
        if( this.__primaryKey.length !== 0 ){
            const key = {}
            this.__primaryKey.map( pk => {
                key[pk] = data[pk]
            });
            const recordExists = await this.#dbo.select(this.__tableName, key);
            if( recordExists ){
                return false;
            }else{
                return true;
            }
        }else{
            return true
        }
    }

    __foreignKeyCheck__ = async (data) => {
        let valid = true;
        for( let i = 0; i < this.__foreignKeys.length; i++ ){
            const { __fieldName, __tableName } = this.__foreignKeys[i];
            const foreignDBObj = this[__tableName];
            const key = {}
            key[ __fieldName ] = data[ __fieldName ];
            await foreignDBObj.model.__dbInit__();            
            const dataExists = await foreignDBObj.model.__findCriteria__( key );
            
            if( !dataExists ){
                valid = false;
            }
        }
        return valid;
    }

    __insertRecord__ = async ( data ) => {
        await this.__dbInit__()
        let serializedData = {};

        this.__fields.map( (field, index) => {
            field.__fieldObject.value( data[ index - 1] )
            serializedData = { ...serializedData, ...field.__fieldObject.serializingValue() }
        })        
        let id = data.id;
        if( !id ){
            id = await this.__getNewId__();
        }            
        const primayKeyCheck = await this.__primaryKeyCheck__( serializedData );
        if( primayKeyCheck ){
            const foreignKeyCheck = await this.__foreignKeyCheck__( serializedData );
            
            if( foreignKeyCheck ){
                const insertResult = await this.#dbo.insert( this.__tableName, { ...serializedData, id } )
                return true
            }else{
                return false;
            }
        }else{
            return false;
        }
    }

    __insertObject__ = async ( serializedData ) => {
        await this.__dbInit__()
        const primayKeyCheck = await this.__primaryKeyCheck__( serializedData );
        if( primayKeyCheck ){
            const foreignKeyCheck = await this.__foreignKeyCheck__( serializedData );
            if( foreignKeyCheck ){
                const insertResult = await this.#dbo.insert( this.__tableName, { ...serializedData } )
                return true
            }else{
                return false;
            }
        }else{
            return false;
        }
    }

    __find__ = async ( amount ) => {
        await this.__dbInit__()
        if( amount === undefined ){
            return await this.#dbo.select( this.__tableName );
        }else{
            if( amount == 0 || amount == 1 ){
                const result = await this.#dbo.select( this.__tableName );
                return result[0]
            }else{
                if( amount > 0 ){
                    const result = await this.#dbo.select( this.__tableName );
                    return result.slice(0, amount)
                }else{
                    return null
                }
            }
        }
    }

    __findCriteria__ = async ( criteria ) => {
        await this.__dbInit__()
        const result = await this.#dbo.select( this.__tableName, criteria );
        return result
    }

    __updateRecord__ = async ( serializedData ) => {
        
    }

    __updateObject__ = async ( serializedData ) => {
        
    }
}


module.exports = Table
