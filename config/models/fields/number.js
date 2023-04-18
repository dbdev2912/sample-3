const Field = require('./field');

class Number extends Field{
    constructor( name, value ){
        super( name, "number", value );
        if( !this.selfValidate() ){
            throw Error ('Giá trị truyền vào không tương thích với kiểu dữ liệu')
        }
    }

    selfValidate = () => {
        /**
            @auth Linguistic
            @desc Kiểm tra giá trị khởi tạo, nếu phù hợp thì passed, còn không thì báo lỗi

            @params \
            @return Boolean
        **/

        const numericChars = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.']
        const value = this.__value;
        if( value === undefined ){
            return true
        }else{
            const stringifiedValue = value.toString();
            let valid = true;
            for( let i = 0 ; i < stringifiedValue.length; i++ ){
                const char = stringifiedValue[i]
                if( numericChars.indexOf( char ) == -1 ){
                    valid = false
                }
            }
            return valid;
        }
    }
}

module.exports = Number
