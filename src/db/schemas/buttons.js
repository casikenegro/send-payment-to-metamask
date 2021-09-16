const mongoose = require("mongoose");
const nameSchema = "buttons";

const schema = {
    type: String,
    color: String,
    value: String,
    buttonScript: String,
    user: [{type: mongoose.Schema.Types.ObjectId, ref: "users", required:true}],
    scripts: [{type: mongoose.Schema.Types.ObjectId, ref: "scripts", required: true}]
};

module.exports = {
    schema,
    nameSchema
}