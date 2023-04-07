/**
    @createOn 06-04-2023
    @description Đối tượng trường.
    @author Cong
**/

const { Database } = require('./../database');

class Field extends Database{
    constructor( fieldName, dataType, fieldValue ){
        super()
        this._dataType   = dataType
        this._fieldName  = fieldName
        this._value      = fieldValue
    }

    value = ( value = undefined ) => {
        if( value == undefined ){
            return this._value
        }else{
            this._value = value
        }
    }

    foreignKey = (table, referencesOn) => {
        this._isForeign    = true;
        this._foreignTable = table;
        this._foreignField = referencesOn;
    }

    primaryTo = (fields) => {
        this._primaryTo = fields;
    }

    slaveData = async (table) => {
        
    }

    foreignData = async () => {
        if( this.dbo == undefined ){
            await this.init()
        }
        const query = {}
        query[this._foreignField] = this._value;
        const data = await this.select(this._foreignTable, query)
        return data
    }

    getType = () => {
        return this._dataType
    }

    getName = () => {
        return this._fieldName
    }
}


module.exports = Field
