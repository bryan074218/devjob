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
    router.get('/vacantes/nueva', vacantesController.formularioVacantes);
    router.post('/vacantes/nueva', vacantesController.agregarVacante);
    
    //mostrar vacantes
    router.get('/vacantes/:url', vacantesController.mostrarVacantes);

    //editar vacantes
    router.get('/vacantes/editar/:url', vacantesController.formEditarVacantes);
    router.post('/vacantes/editar/:url', vacantesController.editarVacante);

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
    router.get('/administracion', authController.mostrarPanel);

    return router;

}