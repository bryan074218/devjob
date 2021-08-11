const passport = require('passport');
const mongoose = require('mongoose');
const Vacante = mongoose.model('vacante');
const Usuarios = mongoose.model('Usuarios');
const crypto = require('crypto');
const enviarEmail = require('../handlers/email');

exports.autenticarUsuario = passport.authenticate('local',{
    successRedirect: '/administracion',
    failureRedirect: '/iniciar-sesion', 
    failureFlash: true,
    badRequestMessage: 'Ambos campos son obligatorio' 
});

//revisar si el usuario esta autenticado o no
exports.verificarUsuario = (req, res, next)=>{
    //revisamos si el usuario esta autenticado
    if(req.isAuthenticated()){
        return next(); // estan autenticados 
    }

    //redireccionar
    res.redirect('/iniciar-sesion');
}

exports.mostrarPanel = async(req, res)=>{

    //consultar el usuario autenticado
    const vacantes = await Vacante.find({autor: req.user._id});

    res.render('administracion',{
        nombrePagina: 'Panel de administracion',
        tagLine: 'Crea y administras tus vacantes desde aqui',
        nombre: req.user.nombre,
        cerrarSesion: true,
        imagen: req.user.imagen,
        vacantes
    }); 
}


exports.cerrarSesion = (req, res)=>{
    req.logout();
    req.flash('correcto', 'Regresa Pronto');
    return res.redirect('/iniciar-sesion');
}


exports.formReestablecerPassword = (req, res ) => {
    res.render('reestablecer-password', {
        nombrePagina : 'Reestablece tu Password',
        tagLine : 'Si ya tienes una cuenta pero olvidaste tu password, coloca tu email'
    })
}

exports.enviarToken = async(req, res, next)=>{
    const usuario = await Usuarios.findOne({email: req.body.email});
    if(!usuario){
        req.flash('error', 'No existe este usuario')
        return res.redirect('/iniciar-sesion');
    }
    //si el usuario existe generar token
    usuario.token = crypto.randomBytes(20).toString('hex');
    usuario.expira = Date.now()+360000;

    //guardamos el usuario
    await usuario.save();
    const resetUrl = `http://${req.headers.host}/reestablecer-password/${usuario.token}`;
    // console.log(resetUrl);

    await enviarEmail.enviar({
        usuario,
        subject : 'Password Reset',
        resetUrl,
        archivo: 'reset'
    });

    
    req.flash('correcto', 'Revisa tu email para restablecer tu email')
    res.redirect('/iniciar-sesion')
    
}

exports.reestablcerPassword = async(req, res,)=>{
    const usuario = await Usuarios.findOne({
        token: req.params.token,
        expira: {
            $gt: Date.now()
        }
    });

    if(!usuario){
        req.flash('error', 'formulario ya no es valido intentalo de nuevo')
        return res.redirect('/reestablecer-password');
    }
    //tyodo bien
    res.render('nuevo-password',{
        nombrePagina: 'Nuevo Password'
    })
}

exports.guardarPassword = async(req, res) =>{
    const usuario = await Usuarios.findOne({
        token: req.params.token,
        expira: {
            $gt: Date.now()
        }
    });

    //no existe el usuario
    if(!usuario){
        req.flash('error', 'formulario ya no es valido intentalo de nuevo')
        return res.redirect('/reestablecer-password');
    }
    //asignar nuevo password, limpiar los valores previos
    usuario.password = req.body.password;
    usuario.token = undefined;
    usuario.expira = undefined;
    
    //agregar y eliminar los valores del objeto
    await usuario.save();

    //redirimos y mandamos una alerta
    req.flash('correcto', 'Password modificado correctamente');
    res.redirect('/iniciar-sesion');
}
