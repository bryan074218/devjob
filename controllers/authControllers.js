const passport = require('passport');

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

exports.mostrarPanel = (req, res)=>{
    res.render('administracion',{
        nombrePagina: 'Panel de administracion',
        tagLine: 'Crea y administras tus vacantes desde aqui'
    });
}

