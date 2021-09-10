const express = require('express');
const app = express();
const router = require("./routes");
const constants = require("./constants");
const port = 3000;

app.set("key",constants.key);
router(app);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

