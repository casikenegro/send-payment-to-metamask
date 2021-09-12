const express = require('express');
const scriptController = require("../../controllers/scripts");
const router = express.Router();

router.post('/', scriptController.createScripts);


module.exports = router;