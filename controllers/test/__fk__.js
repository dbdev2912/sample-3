const { Controller } = require('../../config/controllers');
const Orders = require('../../models/orders');

class ForeignTest extends Controller {
    constructor(){
        super();
        this.__orders = new Orders();
    }

    __insert_order_ = async  (req, res) => {
        const { order } = req.body;
        const insertResult = await this.__orders.insert(order);
        res.status(200).send({ success: insertResult })
    }
}


module.exports = ForeignTest
