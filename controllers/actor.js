const Int = require("../models/database/fields/Int");
const Varchar = require("../models/database/fields/Varchar");

const Actor = {
    fields: [
        new Int("actor_id"),
        new Varchar("f_name"),
        new Varchar("l_name")
    ],
    primaryKey: [
        "actor_id",
    ],
    foreignKeys: [
                
    ]
}

module.exports = Actor
