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
     vacantesController.editarVacante
    );

    //crear cuentas
    router.get('/crear-cuenta', usuarioControllers.formCrearCuenta);
    router.post('/crear-cuenta',
     usuarioControllers.validarRegistro,
     usuarioControllers.crearUsuario
    );

    //autenticar a los usuarios
    router.get('/iniciar-sesion', usuarioControllers.formIniciarSesion);
    router.post('/iniciar-sesion', authController.autenticarUsuario);

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
      usuarioControllers.editarPerfil
    );  

    return router;

}