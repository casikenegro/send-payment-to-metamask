const users = require("./users");
const change = require("./change");

const router = (server) => {
    server.use("/users",users);
    server.use("/change",change);
};

module.exports = router
