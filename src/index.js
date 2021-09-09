const express = require('express');
const app = express();
const router = require("./routes/index");
const connection = require("./db");
const port = 3000;

console.log(connection);
router(app);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

