/**
    @createOn 06-04-2023
    @description Đối tượng chung nhất dành cho việc truy vấn cơ sở dữ liệu
        và sẽ được kế thừa bởi các đối tượng trong folder ./models
    @author Linguistic
**/
require('dotenv').config();
const { dbo } = require('../database/connector');
const db = process.env.STORAGE.toLowerCase();

class MySQL {
    /** 
        @desc Nhỏ này sẽ được định nghĩa sau
    **/
    constructor(){

    }
}

class Mongo {
    constructor(){

    }

    init = async () => {

        /**
         * @desc Khởi tạo liên kết với cơ sở dữ liệu
         *      Vì nhỏ này là phương thức bất đồng bộ nên phải
         *      chạy độc lập so với constructor
         * @params /
         * @author DS
         * 
         */

        const db = await dbo()
        this.dbo = db;
    }

    getAutoIncrementId = async ( table ) => {

        /**
         * @desc Phương thức này dùng để gọi ID tăng tự động của một bảng mỗi khi cần
         *      id mới để thêm một bảng ghi hoặc làm một cái gì đó có cần đến ID duy nhất
         *      Nhỏ này là phương thức bất đồng bộ
         * @params /
         * @author DS
         * 
         */


        const id = await new Promise( (resolve, reject) => {
            this.dbo.collection("auto_increment_collection")
                    .findOne({ name: table }, (err, result) => {
                let newId;
                if( result ){
                    const oldId = result.id;
                    newId = result.id + 1;
                    this.dbo.collection("auto_increment_collection")
                            .updateOne(
                                { name: table },
                                {
                                    $set: {
                                        id: newId
                                    }
                                },
                                (err, result) => {
                                    resolve( oldId )
                                }
                            )
                }else{
                    newId = 1;
                    this.dbo.collection("auto_increment_collection")
                            .insertOne(
                                { name: table, id: newId },
                                (err, result) => {
                                    resolve(0)
                                }
                            )
                }
            })
        });
        return id;
    }

    select = async ( table, criteria = undefined) => {

        /**
         * @desc Select là phương thức gọi dữ liệu từ một bảng thuộc cơ sở dữ liệu
         *     
         *     
         * @params 
         *      - table String - tên bảng cần gọi dữ liệu
         *      - criteria {} - điều kiện dùng để truy vấn dữ liệu. Nếu điều kiện = undefined, nhỏ này
         *     sẽ mặc nhiên hiểu criteria = {} và trả về kết quả là toàn bộ bảng ghi hiện có.
         * @author DS
         * 
         **/


        const query = criteria

        const data = await new Promise( (resolve, reject) => {
            if( criteria != undefined){
                this.dbo.collection( table ).findOne( query, (err, result) => {
                    resolve( result )
                })
            }else{
                this.dbo.collection( table ).find().toArray((err, result) => {
                    resolve( result )
                })
            }
        });
        return data
    }

    insert = async ( table, value ) => {

        /**
         * @desc Insert là phương thức chèn dữ liệu vào một bảng thuộc cơ sở dữ liệu
         *     
         *     
         * @params 
         *      - table String - tên bảng cần thêm dữ liệu
         *      - value {} - Dữ liệu sẽ được thêm mới vào bảng
         * @author DS
         * 
         **/

        let id = value.id;
        if( !id ){
            id = await this.getAutoIncrementId( table );
        }
        const insertResult = await new Promise( (resolve, reject) => {
            this.dbo.collection( table ).insertOne( {id, ...value}, (err, result) => {
                resolve( result )
            })
        });
        return { id, ...value };
    }

    update = async ( table, criteria, newValue ) => {

        /**
         * @desc Update là phương thức cập nhật một hoặc nhiều bảng ghi với một hoặc nhiều giá trị mới
         *     
         *     
         * @params 
         *      - table String - tên bảng cần chỉnh sửa
         *      - criteria {} - điều kiện dùng để truy vấn dữ liệu. 
         *      - value {} - Dữ liệu mới sẽ được cập nhật cho các bảng ghi thỏa mãn criteria
         * @author DS
         * 
         **/

        const query = criteria;
        const updateResult = await new Promise( (resolve, reject) => {
            this.dbo.collection( table ).updateOne( query, { $set: { ...newValue } }, (err, result) => {
                resolve( result )
            })
        });
    }

    delete = async ( table, criteria ) => {
        
        /**
         * @desc Delete là phương thức xóa dữ liệu
         *     
         *     
         * @params 
         *      - table String - tên bảng cần xóa dữ liệu
         *      - criteria {} - điều kiện dùng để xóa dữ liệu. 
         * @author DS
         * 
         **/
        

        const query = criteria;
        const deleteResult = await new Promise( (resolve, reject) => {
            this.dbo.collection( table ).deleteOne( query, (err, result) => {
                resolve( result )
            })
        });
    }
}

let Database;

switch (db) {
    case "mongo":
        Database = Mongo
        break;
    default:
        Database = MySQL
}

module.exports = {
    Database
}
