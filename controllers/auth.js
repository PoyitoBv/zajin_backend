const {response} = require("express");
const bcrypt = require("bcryptjs");

const User = require("../models/user");
const {generarJWT} = require("../helpers/jwt");
const {transporter} = require("../config/mailer");


const crearUser = async (req, res = response) => {

    const { email, password } = req.body;

    try {
        let user;
        let salt;
        
        const existeEmail = await User.findOne({ email });
        if ( existeEmail ) {
            // Verificar si el usuario que ya existe está verificado
            if (existeEmail.verify) {
                return res.status(400).json({
                    ok: false,
                    msg: 'El correo ya está registrado'
                });
            }

            user = existeEmail;
        } else {
            // Si el usuario no existe
            user = new User(req.body);

            // Encriptar contraseña
            salt = bcrypt.genSaltSync();
            user.password = bcrypt.hashSync(password, salt);
            
            // Guardar en la base de datos
            await user.save();
        }
         

        // Generar codigo de verificación
        const cod = (_getRandomArbitrary(1000, 9999) | 0);
        
        // Enviar correo de verificación
        const sended = await sendMail(user, cod);

        if (sended == false) {
            return res.status(400).json({
                ok: false,
                msg: 'Problemas para enviar el correo de verificación'
            });
        }

        res.json({
            ok: true,
            msg: 'User creado, correo enviado',
            code: cod, // Envio el codigo para que backend sepa queso
            user,
        });

    } catch (error) {

        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error con el servidor, intentalo más tarde.'
        });

    }

}

const sendMail = async (user, cod) => {
    try {
        // send mail with defined transport object
        await transporter.sendMail({
            from: '"Zajin Support" <zajin.verify@gmail.com>', // sender address
            to: user.email, // list of receivers
            subject: "Verificación de Correo", // Subject line
            // text: "Hola, guapo. Tu código es " + cod, // plain text body
            html: `
            <b>Tu código de verificación es:</b>
            <h1> ${cod} </h1>
            ` // html body
        });

        // Al terminar manda true para decir que todo está bien
        return true;

    }catch (error) {
        return false;
    }
}

const verifyMail = async (req, res = response) => {

    const { email } = req.body;

    try {
        
        const user = await User.findOneAndUpdate({email: email}, { verify: true });

        if (user == null) {
            return res.status(400).json({
                ok: false,
                msg: 'No se encontró el usuario'
            });
        }
        
        // Generar JWt
        const token = await generarJWT(user.uid);

        res.json({
            ok: true,
            msg: 'Usuario verificado',
            user,
            token
        });
        
    } catch (error) {

        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error con el servidor, intentalo más tarde.'
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
            msg: 'Error con el servidor, intentalo más tarde.'
        });

    }

}

const renewToken = async (req, res = response) => {
    const uid = req.uid;
    
    try {

        const user = await User.findById(uid);

        const token = await generarJWT(user.id);

        console.log('Simon, puede entrar');
        
        res.json({
            ok: true,
            msg: 'Token actualizado',
            user,
            token
        });
            
    } catch (error) {

        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error con el servidor, intentalo más tarde.'
        });

    }
}

function _getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}
  

module.exports = {
    crearUser,
    login,
    renewToken,
    verifyMail,
}