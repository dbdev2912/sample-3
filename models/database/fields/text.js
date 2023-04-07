/**
    @createOn 06-04-2023
    @description Trường Varchar.
    @author Cong
**/

const Field = require('./field')

class Text extends Field {
    constructor( fieldName, fieldValue = ""){
        super( fieldName, "text", fieldValue );
    }
}


module.exports = Text
