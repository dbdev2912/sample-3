const { Controller } = require('../../config/controllers');
const { Customers, Customer } = require('../../models/customers');

class FindTest extends Controller {
    constructor(){
        super();
        this.__customers = new Customers();
    }
    __find_undefined_ = async ( req, res ) => {
        const customers = await this.__customers.find();
        if( customers ){
            res.status(200).send({ success: true, data: customers })
        }
        else{
            res.status(404).send({ success: false, data: "NOT FOUND" })
        }
    }

    __find_one_ = async ( req, res ) => {
        const customer = await this.__customers.find(1);        
        if( customer ){
            const objectiveCustomer = new Customer(customer)
            res.status(200).send({ success: true, data: objectiveCustomer.get() })
        }
        else{
            res.status(404).send({ success: false, data: "NOT FOUND" })
        }
    }

    __find_many_ = async ( req, res ) => {
        const customer = await this.__customers.find(3);        
        if( customer ){
            res.status(200).send({ success: true, data: customer })
        }
        else{
            res.status(404).send({ success: false, data: "NOT FOUND" })
        }
    }

    __find_primary_ = async ( req, res ) => {
 
        // if( customer ){
        //     res.status(200).send({ success: true, data: customer })
        // }
        // else{
        //     res.status(404).send({ success: false, data: "NOT FOUND" })
        // }
    }
}

module.exports = FindTest
