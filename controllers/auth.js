const {response} = require("express");
const bcrypt = require("bcryptjs");

const User = require("../models/user");
const {generarJWT} = require("../helpers/jwt");


const crearUser = async (req, res = response) => {

    const { email, password } = req.body;

    try {

        const existeEmail = await User.findOne({ email });
        if ( existeEmail ) {
            return res.status(400).json({
                ok: false,
                msg: 'El correo ya está registrado'
            });
        }

        const user = new User(req.body);

        // Encriptar contraseña
        const salt = bcrypt.genSaltSync();
        user.password = bcrypt.hashSync(password, salt);
        
        await user.save();

        // Generar JWt
        const token = await generarJWT(user.id);

        res.json({
            ok: true,
            msg: 'User creado',
            user,
            token
        });

    } catch (error) {

        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Se la peló por wey'
        });

    }

}

const login = async (req, res = response) => {

    const { email, password } = req.body;

    try {

        const user = await User.findOne({email});
        if (!user) {
            return res.status(404).json({
                ok: false,
                msg: 'Credenciales no validas'
            });
        }
        
        // Validar el password
        const validPassword = bcrypt.compareSync(password, user.password);
        if (!validPassword) {
            return res.status(400).json({
                ok: false,
                msg: 'Credenciales no validas'
            });
        }

        const token = await generarJWT(user.id);

        res.json({
            ok: true,
            msg: 'User conectado',
            user,
            token
        });

    } catch (error) {

        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Se la peló por wey'
        });

    }

}

const renewToken = async (req, res = response) => {
    const uid = req.uid;
    
    const user = await User.findById(uid);

    const token = await generarJWT(user.id);
    
    res.json({
        ok: true,
        msg: 'Token actualizado',
        user,
        token
    });
}

module.exports = {
    crearUser,
    login,
    renewToken
}