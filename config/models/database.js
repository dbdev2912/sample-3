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
    constructor(){

    }
}

class Mongo {
    constructor(){

    }

    init = async () => {
        const db = await dbo()
        this.dbo = db;
    }

    getAutoIncrementId = async ( table ) => {
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
        const id = await this.getAutoIncrementId( table );
        const insertResult = await new Promise( (resolve, reject) => {
            this.dbo.collection( table ).insertOne( {id, ...value}, (err, result) => {
                resolve( result )
            })
        });
        return { id, ...value };
    }

    update = async ( table, criteria, newValue ) => {
        const query = criteria;
        const updateResult = await new Promise( (resolve, reject) => {
            this.dbo.collection( table ).updateOne( query, { $set: { ...newValue } }, (err, result) => {
                resolve( result )
            })
        });
    }

    delete = async ( table, criteria ) => {
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
