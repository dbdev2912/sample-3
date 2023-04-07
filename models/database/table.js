const { Database } = require('./database');
const Int = require('./fields/int');
class Table extends Database {
    constructor( tableName ){
        super()
        this._tableName = tableName
    }

    primaryKey = (fields) => {
        this._primaryKey = fields
    }
    
    tableFields = (fields) => {
        this._fields = fields;
    }

    find = async ( criteria = undefined ) => {
        if( !this.dbo ){
            await this.init()
        }
        if( criteria != undefined ){
            const data = await this.select( this._tableName, criteria )
            return data;
        }else{
            const data = await this.select( this._tableName )
            return data;
        }
    }

    save = async () => {
        if( !this.dbo ){
            await this.init();
        }
        const data = {}
        for( let i = 0; i < this._fields.length; i++ ){
            const field = this._fields[i]
            data[field] = this[field].value()
        }
        /* Working with primary and foreign constraint! */

        /*===*/
        if( this.id.value() != undefined &&  this.id.value() != '' ){
            const newData = data;
            delete newData.id
            await this.update(this._tableName, { id: this.id.value() } , newData)
        }else{
            const id = await this.insert(this._tableName, data);
            this.id = new Int("id", id);
            this._fields.unshift("id")
        }
    }

    remove = async () => {
        if( !this.dbo ){
            await this.init();
        }
        await this.delete(this._tableName, { id: this.id.value() })
    }

}

module.exports = Table
