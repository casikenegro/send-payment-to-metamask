const users = require("./users");
const scripts = require("./scripts");

const router = (server) => {
    server.use("/users",users);
    server.use("/scripts",scripts);
};

module.exports = router
