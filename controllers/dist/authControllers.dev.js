"use strict";

var passport = require('passport');

var mongoose = require('mongoose');

var Vacante = mongoose.model('vacante');
var Usuarios = mongoose.model('Usuarios');

var crypto = require('crypto');

var enviarEmail = require('../handlers/email');

exports.autenticarUsuario = passport.authenticate('local', {
  successRedirect: '/administracion',
  failureRedirect: '/iniciar-sesion',
  failureFlash: true,
  badRequestMessage: 'Ambos campos son obligatorio'
}); //revisar si el usuario esta autenticado o no

exports.verificarUsuario = function (req, res, next) {
  //revisamos si el usuario esta autenticado
  if (req.isAuthenticated()) {
    return next(); // estan autenticados 
  } //redireccionar


  res.redirect('/iniciar-sesion');
};

exports.mostrarPanel = function _callee(req, res) {
  var vacantes;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return regeneratorRuntime.awrap(Vacante.find({
            autor: req.user._id
          }));

        case 2:
          vacantes = _context.sent;
          res.render('administracion', {
            nombrePagina: 'Panel de administracion',
            tagLine: 'Crea y administras tus vacantes desde aqui',
            nombre: req.user.nombre,
            cerrarSesion: true,
            imagen: req.user.imagen,
            vacantes: vacantes
          });

        case 4:
        case "end":
          return _context.stop();
      }
    }
  });
};

exports.cerrarSesion = function (req, res) {
  req.logout();
  req.flash('correcto', 'Regresa Pronto');
  return res.redirect('/iniciar-sesion');
};

exports.formReestablecerPassword = function (req, res) {
  res.render('reestablecer-password', {
    nombrePagina: 'Reestablece tu Password',
    tagLine: 'Si ya tienes una cuenta pero olvidaste tu password, coloca tu email'
  });
};

exports.enviarToken = function _callee2(req, res, next) {
  var usuario, resetUrl;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.next = 2;
          return regeneratorRuntime.awrap(Usuarios.findOne({
            email: req.body.email
          }));

        case 2:
          usuario = _context2.sent;

          if (usuario) {
            _context2.next = 6;
            break;
          }

          req.flash('error', 'No existe este usuario');
          return _context2.abrupt("return", res.redirect('/iniciar-sesion'));

        case 6:
          //si el usuario existe generar token
          usuario.token = crypto.randomBytes(20).toString('hex');
          usuario.expira = Date.now() + 360000; //guardamos el usuario

          _context2.next = 10;
          return regeneratorRuntime.awrap(usuario.save());

        case 10:
          resetUrl = "http://".concat(req.headers.host, "/reestablecer-password/").concat(usuario.token); // console.log(resetUrl);

          _context2.next = 13;
          return regeneratorRuntime.awrap(enviarEmail.enviar({
            usuario: usuario,
            subject: 'Password Reset',
            resetUrl: resetUrl,
            archivo: 'reset'
          }));

        case 13:
          req.flash('correcto', 'Revisa tu email para restablecer tu email');
          res.redirect('/iniciar-sesion');

        case 15:
        case "end":
          return _context2.stop();
      }
    }
  });
};