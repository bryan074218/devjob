const mongoose = require('mongoose');
const Usuarios = require('../models/Usuarios');
const {
    body,
    validationResult
} = require('express-validator');

exports.formCrearCuenta = (req, res)=>{
    res.render('crear-cuenta', {
        nombrePagina: 'Crea tu cuenta en DevJobs',
        tagLine: 'Comienza a publicar tus vacantes gratis, solo debes crear una cuenta'
    });
}

exports.crearUsuario = async(req, res, next)=>{
    const usuario = new Usuarios(req.body);
    
    const nuevoUsuario = await usuario.save()
    
    if(!nuevoUsuario) return next();

    res.redirect('/iniciar-session');

}

exports.validarRegistro = async(req, res, next)=>{
        //sanitizar los campos

        const rules = [
            body('nombre').not().isEmpty().withMessage('El nombre es obligatorio').escape(),
            body('email').isEmail().withMessage('El email es obligatorio').normalizeEmail(),
            body('password').not().isEmpty().withMessage('El password es obligatorio').escape(),
            body('confirmar').not().isEmpty().withMessage('confirmar password es obligatorio').escape(),
            body('confirmar').equals(req.body.password).withMessage('Los passwords no son iguales')
        ];
     
        await Promise.all(rules.map(validation => validation.run(req)));
        const errores = validationResult(req);
        console.log(errores)
        //si hay errores
        if (!errores.isEmpty()) {
            req.flash('error', errores.array().map(error => error.msg));
            
            res.render('crear-cuenta', {
                nombrePagina: 'Crea una cuenta en Devjobs',
                tagline: 'Comienza a publicar tus vacantes gratis, solo debes crear una cuenta',
                mensajes: req.flash()
            })
            return;
        }
     
        //si toda la validacion es correcta
        next();
}