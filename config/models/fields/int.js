const Field = require('./field');


class Int extends Field{
    constructor( name, value, props ){
        super( name, "number", value );
        
    }
}

module.exports = Int
