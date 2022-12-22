// const {io} = require('../index');

// const { comprobarJWT } = require('../helpers/jwt');
// const {usuarioConectado, usuarioDesconectado, grabarMensaje} = require('../controllers/socket');

// // Mensajes de Sockets
// io.on('connection', client => {
//     // Validar Token
//     const [valido, uid] = comprobarJWT(client.handshake.headers['x-token']);
//     if (!valido) {return client.disconnect();}

//     console.log('Cliente conectado');
//     usuarioConectado(uid);

//     // Ingresar al usuario a una sala
//     client.join(uid);

//     // Escuchar el mensaje personal
//     client.on('mensaje-personal', async (payload) => {
//         console.log(payload);

//         await grabarMensaje(payload);

//         io.to(payload.para).emit('mensaje-personal', payload);
//     });
    
//     client.on('disconnect', () => {
//         usuarioDesconectado(uid);
//         console.log('Cliente desconectado');
//     });
// });