const { Controller } = require('../../config/controllers');
const { Orders, Order } = require('../../models/orders');

class ForeignTest extends Controller {
    constructor(){
        super();
        this.__orders = new Orders();
    }

    __insert_order_ = async  (req, res) => {
        const { order } = req.body; 
        order[2] = new Date();     
        const insertResult = await this.__orders.insert(order);
        res.status(200).send({ success: insertResult })
    }

    __find_fk_ = async (req, res) => {
        const { order_id } = req.params;

        const order = await this.__orders.find({ order_id: parseInt(order_id) });       
        const objectOrder = new Order( order );
        const customer = await objectOrder.getCustomer();       

        res.status(200).send({ order: objectOrder.get(), customer })
    }
}


module.exports = ForeignTest
