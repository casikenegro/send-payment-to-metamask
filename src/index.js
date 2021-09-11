const express = require('express');
const app = express();
const router = require("./routes");
const constants = require("./constants");
const port = 3000;

app.set("key",constants.key);
app.use(express.json());
app.use(express.urlencoded({extended: true}));
router(app);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

