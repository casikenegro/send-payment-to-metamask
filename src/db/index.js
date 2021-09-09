const mongoose = require('mongoose');
const users = require("./schemas/users");

const dbHost = process.env.DB_HOST || "127.0.0.1:27017";
const dbName = process.env.DB_NAME || "metamask";
const uri = process.env.DB_URI || `mongodb://${dbHost}/${dbName}`;


const connection = mongoose.createConnection(uri);

connection.model(users.nameSchema,users.schema);

module.exports = connection