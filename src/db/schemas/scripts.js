const mongoose = require("mongoose");
const nameSchema = "scripts";

const schema = {
    wallet: String, 
    script: String, 
    user: [{ type: mongoose.Schema.Types.ObjectId, ref: 'users',required:true }],
};

module.exports = {
    schema,
    nameSchema
}