const mongoose = require('mongoose');
require('./config/db');
const express = require('express');
const handlebars = require('handlebars');
const exphbs = require('express-handlebars');
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access');
const path = require('path');
//importamos las rutasas
const router = require('./routes');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const bodyParser = require('body-parser');
const passport = require('./config/passport');
const createError = require('http-errors');
const { log } = require('console');

 
require('dotenv').config({path: 'variables.env'})



 
const app = express();



//habilitamos bodyparser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

//habilitamos handlebars como view
app.engine('handlebars',
    exphbs({
        handlebars: allowInsecurePrototypeAccess(handlebars),
        defaultLayout: 'layout',
        helpers: require('./helpers/handlebars')
    })
);

app.set('view engine', 'handlebars');

app.use(express.static(path.join(__dirname, 'public')));

//creamos el puerto donde estara ejecutandose nuestro server
const port = process.env.PUERTO || 3000;



app.use(cookieParser());

app.use(session({
    secret: process.env.SECRETO,
    key: process.env.KEY,
    resave:false,
    saveUninitialized:false,
    store: MongoStore.create({mongoUrl: process.env.DATABASE})
}));

//inciamos passport
app.use(passport.initialize());
app.use(passport.session());


app.use(flash());

// Crear nuestro middleware
app.use((req, res, next) => {
    res.locals.mensajes = req.flash();
    next();
});

//iniciamos las rutas
app.use('/', router());

//404 pagina no existe
// 404 pagina no existente
app.use((req, res, next) => {
    next(createError(404, 'No Encontrada'));
})

// Administración de los errores
app.use((error, req, res, next) => {
    console.log(error);
    res.locals.mensaje = error.message;
    const status = error.status || 500;
    res.locals.status = status;
    res.status(status);
    res.render('error');
});

// iniciamos el servidor
app.listen(port,()=>{
    console.log(`El servidor esta corriendo en el puerto ${port}`);
});