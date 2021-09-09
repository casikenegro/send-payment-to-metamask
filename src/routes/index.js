const users = require("./users");

const router = (server) => {
    server.use("/users",users);
};

module.exports = router
