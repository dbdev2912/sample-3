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
const Actor = require("./controllers/actor");

app.get('/', async (req, res) => {
    res.status(403).send({ success: true, content: "Opps", data: {  } })
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
