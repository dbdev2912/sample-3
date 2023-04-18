const Field = require('./field');

class Datetime extends Field{
    constructor( name, value ){
        super( name, "datetime", value );
    }
}

module.exports = Datetime
