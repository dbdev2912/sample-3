const { Database } = require('./database');
const Int = require('./fields/int');

class Record extends Database {
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
        const id = await this.insert(this._tableName, data);
        this._id = new Int("id", id);
        this._fields.unshift("id")
    }
    update = async ( field, value ) => {
        if( !this.dbo ){
            await this.init();
        }
    }
}

module.exports = Record
