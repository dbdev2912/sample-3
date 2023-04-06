/**
    @createOn 06-04-2023
    @description Trường Varchar.
    @author Cong
**/

const Field = require('./field')

class Varchar extends Field {
    constructor( fieldName, length = 255, fieldValue = ""){
        super( fieldName, "varchar", fieldValue );
        this.length = length
    }

    setMaxLength = ( lenght ) => {
        this.length = length
    }

    toInt = () => {
        /* Chưa cần dùng đến ép kiểu từ String sang Int */
    }
}


module.exports = Varchar
