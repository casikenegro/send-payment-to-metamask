const { generateScript } = require("../../utils");
const { ScriptModel } = require("../../db");

const createScripts = async (req,res) => {
    const { type, wallet, amount} = req.body;
    const script = generateScript(amount,wallet,type);
    return res.json(script);
};

module.exports = { createScripts }