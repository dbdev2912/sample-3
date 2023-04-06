/**
    @createOn 06-04-2023
    @description Trường Char.
    @author Cong
**/

const Field = require('./field')

class Char extends Field {
    constructor( fieldName, length = 255, fieldValue = ""){
        super( fieldName, "Char", fieldValue );
        this.length = length
    }

    setMaxLength = ( lenght ) => {
        this.length = length
    }
}


module.exports = Char
