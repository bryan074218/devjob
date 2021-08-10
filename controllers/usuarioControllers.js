const {body,validationResult} = require('express-validator');
const mongoose = require('mongoose');
const Usuarios = require('../models/Usuarios');
const multer = require('multer');
const shortid = require('shortid');


exports.subirImagen = (req, res, next)=>{

    upload(req, res, function(error){
        if(error){
            //si el error es de multer cae en este if
            //sino pasa al siguente evaluacion
            if(error instanceof multer.MulterError){
                if(error.code === 'LIMIT_FILE_SIZE'){
                    req.flash('El archivo es muy grande: Maximo 100KB');
                }else{
                    req.flash('error', error.message);
                }
            }else{
                req.flash('error', error.message)
            }
            res.redirect('/administracion')
            return;
        }else{
            return next();
        }
    });
}
//cofiguracion de multer
const configuracionMulter = {

    storage: fileStorage = multer.diskStorage({
        destination: (req, res, cb)=>{
            cb(null, __dirname+'../../public/uploads/perfiles');
        },
        filename: (req, file, cb)=>{
            const extension =   file.mimetype.split('/')[1];
            cb(null, `${shortid.generate()}.${extension}`);
        }
    }),
    fileFilter(req, file, cb){
        if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
            //el callback se ejecuta como true o false : true la imagene es correcta
            cb(null, true)
        }else{
            cb(new Error('Formato no valido'), false)
        }
    },
    limits: {fileSize: 100000}
}


const upload = multer(configuracionMulter).single('imagen');


exports.formCrearCuenta = (req, res)=>{
    res.render('crear-cuenta', {
        nombrePagina: 'Crea tu cuenta en DevJobs',
        tagLine: 'Comienza a publicar tus vacantes gratis, solo debes crear una cuenta'
    });
}


exports.validarRegistro = async (req, res, next) => {
    //sanitizar los campos
    const rules = [
        body('nombre').not().isEmpty().withMessage('El nombre es obligatorio').escape(),
        body('email').isEmail().withMessage('El email es obligatorio').normalizeEmail(),
        body('password').not().isEmpty().withMessage('El password es obligatorio').escape(),
        body('confirmar').not().isEmpty().withMessage('Confirmar password es obligatorio').escape(),
        body('confirmar').equals(req.body.password).withMessage('Los passwords no son iguales')
    ];
 
    await Promise.all(rules.map(validation => validation.run(req)));
    const errores = validationResult(req);
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
 
exports.crearUsuario = async(req, res, next)=>{
    const usuario = new Usuarios(req.body);
    
    try {
        await usuario.save()    
        res.redirect('/iniciar-sesion');
    } catch (error) {
        req.flash('error', error);
        res.redirect('/crear-cuenta');
    }

} 

exports.formIniciarSesion = (req, res)=>{
    res.render('iniciar-sesion', {
        nombrePagina: 'Iniciar sesion en DevJbos'
    })
}

exports.formEditarPerfil = (req, res)=>{
    res.render('editar-perfil',{
        nombrePagina: 'Editar tu perfil en DevJobs',
        usuario: req.user,
        cerrarSesion: true,
        imagen: req.user.imagen,
        nombre: req.user.nombre
    });
}

//validar y sanitizar  el fomulario de editar pefiles
exports.validarPerfil = async(req, res, next)=>{
    if(req.body.password ===''){
        //sanitizar los campos
        const roles = [
            body('nombre').not().isEmpty().withMessage('El nombre es obligatorio').escape(),
            body('email').isEmail().withMessage('El email es obligatorio').normalizeEmail(),    
            body('password').escape()        
        ]
        await Promise.all(roles.map(validation => validation.run(req)));
        const errores = validationResult(req);
        if(!errores.isEmpty()){
            
            req.flash('error', errores.array().map(error => error.msg));

            res.render('editar-perfil',{
                nombrePagina: 'Editar tu perfil en DevJobs',
                usuario: req.user,
                cerrarSesion: true,
                nombre: req.user.nombre,
                imagen: req.user.imagen,
                mensajes: req.flash()
            });
            return;
        }
        next();
    }


} 

//guardar cambios de editar perfil
exports.editarPerfil = async(req, res)=>{
    const usuario = await Usuarios.findById(req.user._id);
    
    usuario.nombre = req.body.nombre;
    usuario.email = req.body.email;
    if(req.body.password){
        usuario.password = req.body.password
    }
    if(req.file){
        usuario.imagen = req.file.filename;
    }
    await usuario.save();

    req.flash('correcto', 'Cambios guardados Correctamente');

    //redirect
    res.redirect('/administracion');
}



