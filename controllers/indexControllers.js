const mongoose = require('mongoose');
const Vancante = mongoose.model('vacante')

exports.index = async (rq, res, next)=>{

    const vacantes = await Vancante.find();
 
    if(!vacantes) return next();

    res.render('home',{
        nombrePagina: 'devJobs',
        tagLine: 'Encuentra y publica trabajos para Desarolladores Web',
        barra: true,
        boton: true,
        vacantes
    });
}
