const {response} = require("express");

const User = require("../models/user");


const editUser = async (req, res = response) => {

    const uid = req.uid;
    const { user } = req.body;

    try {
        
        const oldUser = await User.findByIdAndUpdate(uid, {
            edad: user.edad,
            genero: user.genero,
            user: user.user
        });

        if (oldUser == null) {
            return res.status(400).json({
                ok: false,
                msg: 'No se encontró el usuario'
            });
        }

        const updatedUser = await User.findById(uid);

        res.json({
            ok: true,
            msg: 'Cambios guardados',
            user: updatedUser,
        });
        
    } catch (error) {

        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error con el servidor, intentalo más tarde.'
        });

    }

}
  

module.exports = {
    editUser
}