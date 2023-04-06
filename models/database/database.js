/**
    @createOn 06-04-2023
    @description Đối tượng chung nhất dành cho việc truy vấn cơ sở dữ liệu
        và sẽ được kế thừa bởi các đối tượng trong folder ./models
    @author Cong
**/
require('dotenv').config();

const { dbo } = require('../../config/database/connector');
const db = process.env.STORAGE.toLowerCase();

class MySQL {
    constructor(){

    }
    init = async () => {
        const db = await dbo()
        this.dbo = db;
    }

    select = async ( table, criteria ) => {
        const { field, value } = criteria;
        const data = await new Promise( (resolve, reject) => {
            this.dbo.query( `SELECT * FROM ?? WHERE ?? = ?`, [ table, field, value ], (err, result, fields) => {
                resolve( result )
            })
        });
        return data
    }
}

class Mongo {
    constructor(){

    }

    init = () => {
        const db = await dbo()
        this.dbo = db;
    }

    select = async ( table, criteria ) => {
        const { field, value } = criteria;
        const query = {}
        query[ field ] = value;
        const data = await new Promise( (resolve, reject) => {
            this.dbo.findOne( query, (err, result) => {
                resolve( result )
            })
        });
        return data
    }

    insert = async ( table, value ) => {
        const insertResult = await new Promise( (resolve, reject) => {
            this.dbo.insertOne( query, (err, result) => {
                resolve( result )
            })
        });
    }

    update = async ( table, criteria, newValue ) => {

        const { field, value } = criteria;
        const query = {}
        query[ field ] = value;
        
        const updateResult = await new Promise( (resolve, reject) => {
            this.dbo.updateOne( query, { $set: { ...newValue } }, (err, result) => {
                resolve( result )
            })
        });
    }

    delete = async ( table, criteria ) => {
        const { field, value } = criteria;
        const query = {}
        query[ field ] = value;
        const deleteResult = await new Promise( (resolve, reject) => {
            this.dbo.deleteOne( query, (err, result) => {
                resolve( result )
            })
        });
        return data
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
