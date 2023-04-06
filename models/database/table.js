class Table {
    constructor( tableName ){
        this.tableName = tableName
    }

    primaryKey = (fields) => {
        this.primaryKey = fields
    }
}

module.exports = Table
