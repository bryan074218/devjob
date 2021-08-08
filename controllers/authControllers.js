const passport = require('passport');
const mongoose = require('mongoose');
const Vacante = mongoose.model('vacante');

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
        vacantes
    }); 
}