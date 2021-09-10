
const login = (req,res) => {
    // if(req.body.usuario === "asfo" && req.body.contrasena === "holamundo") {
    //     const payload = {
    //      check:  true
    //     };
    //     const token = jwt.sign(payload, app.get('llave'), {
    //      expiresIn: 1440
    //     });
    //     res.json({
    //      mensaje: 'Autenticación correcta',
    //      token: token
    //     });
    //       } else {
    //           res.json({ mensaje: "Usuario o contraseña incorrectos"})
    //     }
    return res.send({ message: "hoola desde el login",naruto: req.query, body: req.body})

}

module.exports =  {
    login
}