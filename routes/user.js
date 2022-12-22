/*
    path: /api/user
*/

const { Router } = require('express');
const { check } = require('express-validator');

const { editUser } = require('../controllers/user');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();


router.post('/edit', [
    check('user', 'El usuario es obligatorio').exists(),
    validarCampos,
    validarJWT,
], editUser);

module.exports = router;