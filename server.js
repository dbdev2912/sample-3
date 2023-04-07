var express = require('express');
var app = express();
const cors = require("cors");
const bodyparser = require('body-parser');
require('dotenv').config();

app.use(bodyparser.urlencoded({
    limit: "50mb",
    extended: false,
}));


app.use(bodyparser.json({ limit: "50mb" }));
app.use( express.static('public') );
app.use( cors() )

// const Actor = require('./models/models/actor')
// const Actor = require("./controllers/actor");

const Customer = require('./models/models/records/customer')
const Customers = require('./models/models/tables/customers')

app.get('/', async (req, res) => {
    const customer = {
        customer_id: 125,
        customer_name: "Vintage Cloak",
        address: "District 51",
        date_of_birth: new Date(Date.parse("2000-12-29"))
    }
    const cus = new Customer(customer)
    await cus.save()

    res.status(403).send({ success: true, content: "Opps", data: cus.get() })
})

app.get('/cus/:cus_id', async (req, res) => {
    const id = parseInt(req.params.cus_id)
    const customers = new Customers()

    const customer = await customers.getCustomer(id)
    if( customer ){
        const cus = new Customer( customer )
        res.status(200).send({ success: true, data: cus.get() })
    }else{
        res.status(404).send("Not found")
    }
})

app.get('/all', async (req, res) => {
    const cus = new Customers()
    const data = await cus.getCustomers();
    res.status(200).send({ success: true, content: "Opps", data })
})

app.put('/update/:id', async (req, res) => {
    const id = parseInt( req.params.id )
    const customers = new Customers()
    const customer = await customers.getCustomer(id)
    const { newValues } = req.body;
    if( customer ){
        const cus = new Customer(customer);
        const oldCus = cus.get()
        const { customer_name, address } = newValues;
        cus.customer_name.value(customer_name);
        cus.address.value(address)

        await cus.saveCustomer()
        res.status(200).send({ success: true, data: { oldCus, newCus: cus.get() } })
    }else{
        res.status(404).send("Not found")
    }
})

app.delete('/delete/:id', async (req, res) => {
    const id = parseInt(req.params.id)
    console.log(id)

    const customers = new Customers()
    const customer = await customers.getCustomer(id)
    if( customer ){
        const cus = new Customer( customer )
        await cus.deleteCustomer()
        res.status(201).send({ content: "Success", data: cus.get() })
    }else{
        res.status(404).send("Not found")
    }
})

app.get('/hw', (req, res) => {
    res.status(200).send({ success: true, content: "Hello From Server" })
})

app.use((req, res, next) => {
    res.status(404).send("404 - PAGE NOT FOUND")
})

var server = app.listen(process.env.PORT, function () {
  console.log('Server listening on port ' + server.address().port);
});

module.exports = app;
