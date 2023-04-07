/**
    @createOn 06-04-2023
    @description Trường Int.
    @author Cong
**/

const Field = require('./field')

class DateTime extends Field {
    constructor( fieldName, fieldValue = new Date() ){
        super( fieldName, "DATE", fieldValue );
    }
}


module.exports = DateTime
