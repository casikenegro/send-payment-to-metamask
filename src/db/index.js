const mongoose = require('mongoose');
const usersSchema = require("./schemas/users");
const scriptSchema = require("./schemas/scripts");

const dbHost = process.env.DB_HOST || "127.0.0.1:27017";
const dbName = process.env.DB_NAME || "metamask";
const uri = process.env.DB_URI || `mongodb://${dbHost}/${dbName}`;


const connection = mongoose.createConnection(uri);
const UserModel = connection.model(usersSchema.nameSchema,usersSchema.schema);
const ScriptModel = connection.model(scriptSchema.nameSchema,scriptSchema.schema);

module.exports = {
    UserModel,
    ScriptModel
}