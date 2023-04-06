/**
    @createOn 06-04-2023
    @description Đối tượng trường.
    @author Cong
**/

const { Database } = require('./../database');

class Field extends Database{
    constructor( fieldName, dataType, fieldValue ){
        super()
        this.dataType   = dataType
        this.fieldName  = fieldName
        this.value      = fieldValue
    }

    value = ( value = undefined ) => {
        if( value == undefined ){
            return this.value
        }else{
            this.value = value
        }
    }

    foreignKey = (table, referencesOn) => {
        this.isForeign    = true;
        this.foreignTable = table;
        this.foreignField = referencesOn;
    }

    foreignData = async () => {
        if( this.dbo == undefined ){
            await this.init()
        }
        const data = await this.select(this.foreignTable, { field: this.foreignField, value: this.value })
        return data
    }

    getType = () => {
        return this.dataType
    }

    getName = () => {
        return this.fieldName
    }
}


module.exports = Field
