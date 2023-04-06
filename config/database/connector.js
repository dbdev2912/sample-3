/* Database connector */

require('dotenv').config()
const mysql = require('mysql')
const { STORAGE } = process.env;
let connector;


if( STORAGE && STORAGE.toLowerCase() === "mysql" ){
    const { HOST, USER, PASSWORD, DATABASE } = process.env;
    connector = mysql.createConnection({
        host: HOST,
        user: USER,
        password: PASSWORD,
        database: DATABASE
    });

    module.exports = {
        dbo: async () => {
            return new Promise((resolve, reject) => {
                connector.connect(() => {
                    resolve( connector )
                })
            });
        }
    }
} else {
    const { MONGOSRV } = process.env;
    module.exports = {
        dbo: async () => {
        return new Promise((resolve, reject) => {
            MongoClient.connect(connectionString, function(err, db) {
                if (err) throw err;
                    const dbo = db.db(dbName);
                    resolve(dbo);
                })
            });
        }
    }
}
