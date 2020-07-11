const Usuario = require('../models/Usuario');
const bcryptjs = require('bcryptjs');
const { validationResult } = require('express-validator')
const jwt = require('jsonwebtoken')

exports.crearUsuario = async (req, res) => {

    // Revisamos si hay errores
    const errores = validationResult(req);
    if(!errores.isEmpty()){
        return res.status(400).json({ errores: errores.array() });
    }

    // Extraer email y password
    const { email, password } = req.body;

    try {
        // Revisar que el email sea unico
        let usuario = await Usuario.findOne({ email });

        if(usuario) return res.status(400).json({ msg: 'El usuario ya existe' })

        // Crear usuario
        usuario = new Usuario(req.body);

        // Crear el JWT
        const payload = {
            usuario: {
                id: usuario.id
            }
        };

        // Firmar el JWT
        jwt.sign(payload, process.env.SECRET, {
            expiresIn: 3600
        }, (error, token) => {
            if(error) throw error;
            res.json({ token })
        })

        // Hashear el password
        const salt = await bcryptjs.genSalt(10);
        usuario.password = await bcryptjs.hash(password, salt)

        // Guardar usuario
        await usuario.save();

        // Mensaje de confirmacion
        res.json({ msg: 'Usuario creado correctamente' })
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}
