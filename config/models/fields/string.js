const Field = require('./field');


class String extends Field{
    constructor( name, value ){
        super( name, "string", value );
    }
}

module.exports = String
