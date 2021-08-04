const mongoose = require('mongoose');
require('dotenv').config({path: 'variables.env'});

//iniciamos la configuracion para conectarnos a la DB
mongoose.connect(process.env.DATABASE,{
    useNewUrlParser:true,
    useUnifiedTopology: true,
    useFindAndModify: false
});
 
mongoose.connection.on('error', (error)=>{
    console.log(error);
});

//importamos los modelos
require('../models/Vacantes');
require('../models/Usuarios');