const express = require('express');
const router = express.Router();
const indexControllers = require('../controllers/indexControllers');
const vacantesController = require('../controllers/vacanteControllers.js');
const usuarioControllers = require('../controllers/usuarioControllers');
const authController = require('../controllers/authControllers');

module.exports = function(){
    //pagina de inciio
    router.get('/', indexControllers.index);

    //creacion de vacantes
    router.get('/vacantes/nueva',
     authController.verificarUsuario,
     vacantesController.formularioVacantes
    );
    router.post('/vacantes/nueva',
     authController.verificarUsuario,
     vacantesController.validarVacantes,
     vacantesController.agregarVacante
    );
    
    //mostrar vacantes(singular)
    router.get('/vacantes/:url', vacantesController.mostrarVacantes);

    //editar vacantes
    router.get('/vacantes/editar/:url',
     authController.verificarUsuario,
     vacantesController.formEditarVacantes
    );
    router.post('/vacantes/editar/:url',
     authController.verificarUsuario,
     vacantesController.validarVacantes,
     vacantesController.editarVacante
    );

    //eliminar vacantes
    router.delete('/vacantes/eliminar/:id',
     vacantesController.eliminarVacantes
    )

    //crear cuentas
    router.get('/crear-cuenta', usuarioControllers.formCrearCuenta);
    router.post('/crear-cuenta',
     usuarioControllers.validarRegistro,
     usuarioControllers.crearUsuario
    );

    //autenticar a los usuarios
    router.get('/iniciar-sesion', usuarioControllers.formIniciarSesion);
    router.post('/iniciar-sesion', authController.autenticarUsuario);

    //cerrar sesiones
    router.get('/cerrar-sesion', 
      authController.verificarUsuario,
      authController.cerrarSesion
    )

    //resetear password
    router.get('/reestablecer-password', authController.formReestablecerPassword);
    router.post('/reestablecer-password', authController.enviarToken);


    //resetear y guardar en la db
    router.get('/reestablecer-password/:token', authController.reestablcerPassword);
    router.post('/reestablecer-password/:token', authController.guardarPassword);



    //panel de administracion 
    router.get('/administracion',
     authController.verificarUsuario,
     authController.mostrarPanel
    );

    //editar perfil
    router.get('/editar-perfil',
      authController.verificarUsuario,
      usuarioControllers.formEditarPerfil
    );

    router.post('/editar-perfil',
      authController.verificarUsuario,
      // usuarioControllers.validarPerfil,
      usuarioControllers.subirImagen,
      usuarioControllers.editarPerfil
    );  

    //recivir los mensajes de candidatos
    router.post('/vacantes/:url',
    vacantesController.subirCV,
    vacantesController.contactar
    );

    //muestra los candidatos por vacantes
    router.get('/candidatos/:id',
      authController.verificarUsuario,
      vacantesController.mostrarCandidatos
    );

    //buscador de bacantes
    router.post('/buscador', vacantesController.buscarVacantes)

    return router;

}