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
const { Test } = require('./routes')

app.use('/test', Test )



var server = app.listen(process.env.PORT, function () {
  console.log('Server listening on port ' + server.address().port);
});

module.exports = app;
