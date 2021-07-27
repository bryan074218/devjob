const express = require('express');
const router = express.Router();
const indexControllers = require('../controllers/indexControllers');
const vacantesController = require('../controllers/vacanteControllers.js');
module.exports = function(){
    //pagina de inciio
    router.get('/', indexControllers.index);

    //creacion de vacantes
    router.get('/vacantes/nueva', vacantesController.formularioVacantes);
    router.post('/vacantes/nueva', vacantesController.agregarVacante);
    
    //mostrar vacantes
    router.get('/vacantes/:url', vacantesController.mostrarVacantes);


    return router;
    git config --global user.email "bryangomez665@gmail.com"
    git config --global user.name "bryan074218"
}