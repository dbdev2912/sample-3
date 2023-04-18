const Table = require('./table');
const { Number, String, Datetime } = require('./fields');

class Model {
    static types = {
        number: Number,
        string: String,
        datetime: Datetime,
    }
    constructor(modelName){
        this.model = new Table(modelName)
    }

    find = async ( amount = undefined ) => {
        return await this.model.__find__( amount )
    }

    insert = async ( data ) => {
        return await this.model.__insertOne__( data );
    }
}


module.exports = Model
