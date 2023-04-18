const { Controller } = require('../../config/controllers');
const Customers = require('../../models/customers');

class InsertTest extends Controller {
    constructor(){
        super();
        this.__customers = new Customers();
    }
    __insert_one_ = async ( req, res ) => {
        const { customer } = req.body;
        const insertResult = await this.__customers.insert(customer);
        res.status(201).send({ success: insertResult })
    }
}

module.exports = InsertTest
