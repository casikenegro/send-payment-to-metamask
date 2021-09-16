const mongoose = require("mongoose");
const nameSchema = "buttons";

const schema = {
    buttonScript: String,
    description:{ type: String, required: false},
    user: {type: mongoose.Schema.Types.ObjectId, ref: "users", required:true},
    scripts: {type: mongoose.Schema.Types.ObjectId, ref: "scripts", required: true}
};

module.exports = {
    schema,
    nameSchema
}