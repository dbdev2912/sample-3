const { Controller } = require('../../config/controllers');
const { Customers, Customer } = require('../../models/customers');

class InsertTest extends Controller {
    constructor(){
        super();
        this.__customers = new Customers();        
    }
    __insert_one_ = async ( req, res ) => {
        const { customer } = req.body;
        const objectiveCustomer = new Customer( customer );        
        const saveResult = await objectiveCustomer.save()
        if( saveResult ){
            res.status(201).send({ success: true, customer: objectiveCustomer.get() })
        }
        else{
            res.status(403).send({ success: false })
        }
    }
}

module.exports = InsertTest
