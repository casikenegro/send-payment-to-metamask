const mongoose = require("mongoose");
const nameSchema = "scripts";

const schema = {
    wallet: String, 
    script: String, 
    amount: Number,
    description:{ type: String, required: false},
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'users',required:true },
    type: {type: String, enum: ["USDT", "BNB"], required: true}
};

module.exports = {
    schema,
    nameSchema
}