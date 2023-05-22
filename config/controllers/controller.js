const jwt = require('jsonwebtoken');
require('dotenv').config()
class Controller {    
    constructor(){
        this.tokenKey = process.env.TOKEN_KEY
    }

    notNullCheck = ( data, fields) => { 

        /**
         * @desc Đọc tuần tự dữ liệu của data dựa vào thuộc tính là các tên trong danh sách fields, 
         *      Nếu tất cả các trường đều tồn tại thì trả về { valid: true, nullFields: [] }
         *      Nếu một trường có giá trị là undefined thì đặt lại valid bằng false, thêm trường đó vào danh sách
         *      nullFields và tiếp tục cho đến khi kết thúc danh sách, trả về { valid: false, nullFields }
         * 
         * @params
         *      data    <Obj>
         *      fields  <String>[]
         * @author Linguistic
         * 
         */
        let valid = true;
        const nullFields = []
        for( let i = 0; i < fields.length; i++ ){
            const field = fields[i];
            if( data[field] == undefined ){
                valid = false;
                nullFields.push(field)
                this.errorLog(`${ field } NULL`)
            }
        }
        return { valid, nullFields };
    }

    makeToken = ( data ) => { 
        /**
         * @desc Tạo một token từ Data, token có hiệu lực 1h
         * 
         * @params
         *      data    <Obj>
         * @author Linguistic
         * 
         */

        const token = jwt.sign(data, this.tokenKey, { expiresIn: '1h' });
        return token;
    }

    decodeToken = (token) => { 
        /**
         * @desc Dịch ngược token về dữ liệu dạng Object
         * 
         * @params
         *      token    <JWT>
         * @author Linguistic
         * 
         */
        const result = jwt.decode(token);
        return result;
    }

    verifyToken = async (req) => {
        /**
         * @desc Xác thực token từ headers của request,
         *      Nếu token tồn tại và còn thời hạn thì trả về true,
         *      không thì false chứ còn cái gì nữa ?
         *  
         * @params
         *      req    <Express.Request>
         * @author Linguistic
         * 
         */
        const token = req.header('Authorization');
        if( !token ){
            return false;
        }else{
            const result = await new Promise( (resolve, reject) => {
                jwt.verify(token, this.tokenKey, ( err, decoded ) => {
                    resolve({ err, decoded })
                })
            })
            if( result.err ){
                return false;
            }
            return true
        }
    }

    writeReq = (request) => {
        const { originalUrl, method } = request
        console.log(`REQ: ${ method } - ${  originalUrl }`)
    }

    writeRes = (response) => {
        const { status, message } = response;
        console.log(`RES: ${ status } - ${ message }`)
    } 

    successLog = (msg, prefix="" ) => {
        console.log(`${prefix}PASSED:   ${msg}`)
    }
    
    errorLog = (msg, prefix="" ) => {
        console.log(`${prefix}ERROR!:   ${ msg }`)
    }
    
    warningLog = (msg, prefix="" ) => {
        console.log(`${prefix}WARNNING: ${ msg }`)
    }
    
    infoLog = (msg, prefix="" ) => {
        console.log(`${prefix}INFOR:    ${ msg }`)
    }
    
}

module.exports = Controller
