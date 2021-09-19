const users = require("./users");
const scripts = require("./scripts");
const currency = require('./currency');

const router = (server) => {
    server.use("/users",users);
    server.use("/scripts",scripts);
    server.use('/currency', currency);
};

module.exports = router
