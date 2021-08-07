const mongoose = require('mongoose');
require('./config/db');

const express = require('express');
const handlebars = require('handlebars');
const exphbs = require('express-handlebars');
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access');
const path = require('path');
require('dotenv').config({path: 'variables.env'})
//importamos las rutasas
const router = require('./routes');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const flash = require('connect-flash');

 

 
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

//iniciamos las rutas
app.use('/', router());

app.use(cookieParser());

app.use(session({
    secret: process.env.SECRETO,
    key: process.env.KEY,
    resave:false,
    saveUninitialized:false,
    store: MongoStore.create({mongoUrl: process.env.DATABASE})
}));

//aletas y flash message
app.use(flash()); 
//creamos nuestros middelware
app.use((req, res, next) => {
    res.locals.mensajes = req.flash();
    next();
});

// iniciamos el servidor
app.listen(port,()=>{
    console.log(`El servidor esta corriendo en el puerto ${port}`);
});