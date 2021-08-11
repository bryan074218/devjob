"use strict";

var emailConfig = require('../config/email');

var nodemailer = require('nodemailer');

var hbs = require('nodemailer-express-handlebars');

var util = require('util');

var transport = nodemailer.createTransport({
  host: emailConfig.host,
  port: emailConfig.port,
  auth: {
    user: emailConfig.user,
    pass: emailConfig.pass
  }
}); // Utilizar templates de Handlebars

transport.use('compile', hbs({
  viewEngine: {
    extName: 'handlebars',
    partialsDir: __dirname + '/../views/emails',
    layoutsDir: __dirname + '/../views/emails',
    defaultLayout: 'reset.handlebars'
  },
  viewPath: __dirname + '/../views/emails',
  extName: '.handlebars'
}));

exports.enviar = function _callee(opciones) {
  var opcionesEmail, sendMail;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          opcionesEmail = {
            from: 'devJobs <noreply@devjobs.com',
            to: opciones.usuario.email,
            subject: opciones.subject,
            template: opciones.archivo,
            context: {
              resetUrl: opciones.resetUrl
            }
          };
          sendMail = util.promisify(transport.sendMail, transport);
          return _context.abrupt("return", sendMail.call(transport, opcionesEmail));

        case 3:
        case "end":
          return _context.stop();
      }
    }
  });
};