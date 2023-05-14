
const { Controller } = require('../../config/controllers');
const { Customers, Customer } = require('../../models/customers');
const { Orders, Order } = require(  '../../models/orders');

class __update__ extends Controller {    
    constructor(){
        super();
        this.customers = new Customers()
        this.orders = new Orders();
    }
    __update_customer_ = async (req, res) => {
        const rawCustomer = await this.customers.find({ customer_id: "2" });
        const customer = new Customer(rawCustomer);
        customer.customer_id.value("2")
        customer.customer_name.value("Bành Mốc")
        customer.gender.value(0)
        const saveResult = await customer.save()        
        res.status(200).send({ success: true, customer: customer.get() })
    }

    __update_order_ = async ( req, res ) => {
        const rawOrder = await this.orders.find(1);
        const order = new Order(rawOrder);
        order.customer_id.value(101)
        const saveResult = await order.save()        
        res.status(200).send({ success: true, order: order.get() })
    }
}
module.exports = __update__

    