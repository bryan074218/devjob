const passport = require('passport');   
const localStragery = require('passport-local').Strategy;
const mongoose = require('mongoose');
const Usuario = require('../models/Usuarios');

passport.use(new localStragery({
    usernameField: 'email',
    passwordField: 'password'
    }, async(email, password, done)=>{
        const usuario = await Usuario.findOne({ email });

        if(!usuario) return done(null, false, {
            message: 'Ususario ya existente'
        });

        //el usuario existe vamos a verficarlo
        const verifcarPass = usuario.compararPassword(password);
        if(!verifcarPass) return done(null, false, {
            message: 'Password incorecto'
        });

        //usuario exste y el password es correcto
        return done(null, usuario);
    }));

passport.serializeUser((usuario, done) => done(null, usuario._id))

passport.deserializeUser(async(id, done)=>{
    const usuario = await Usuario.findById(id).exec();
    return done(null, usuario);
});

module.exports = passport;   