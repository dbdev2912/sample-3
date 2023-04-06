/**
    @createOn 06-04-2023
    @description Trường Int.
    @author Cong
**/

const Field = require('./field')

class Int extends Field {
    constructor( fieldName, fieldValue = ""){
        super( fieldName, "Int", fieldValue );
    }
}


module.exports = Int
