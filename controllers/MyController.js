
const { Controller } = require('../config/controllers');
const { MyModel, MyModelRecord } = require('../models/MyModel');

class MyController extends Controller {
    constructor(){
        super();
        this.__myModel = new MyModel()
    }

    get = async ( req, res ) => {
        this.writeReq(req)

        /* Logical code goes here */

        const record = new MyModelRecord({ MyModel_id: 0 });
        this.writeRes({ status: 200, message: "Sample response" })
        res.status(200).send({
            success: true,
            content: "Sample response",
            data: [ record.get() ]
        })
    }   

}
module.exports = MyController

    