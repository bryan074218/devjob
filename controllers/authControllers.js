const passport = require('passport');

exports.autenticarUsuario = passport.authenticate('local',{
    successRedirect: '/administracion',
    failureRedirect: '/iniciar-sesion',
    failureFlash: true,
    badRequestMessage: 'Ambos campos son obligatorio'
});

exports.mostrarPanel = (req, res)=>{
    res.render('administracion',{
        nombrePagina: 'Panel de administracion',
        tagLine: 'Crea y administras tus vacantes desde aqui'
    });
}

