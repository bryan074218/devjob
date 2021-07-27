const mongoose = require('mongoose');
const Vancante = mongoose.model('vacante')


exports.formularioVacantes = (req, res)=>{
    res.render('nueva-vacante',{
        nombrePagina: 'Nueva Vacante',
        tagLine: 'Llena el Formulario y publica Vacantes'
    });
}

//agregar una nueva vacante a la BD
exports.agregarVacante = async (req, res)=>{
    const vacante = new Vancante(req.body);
    //crear arreglos para nuestros skills

    vacante.skills = req.body.skills.split(',');
    //almacenar en la bd
    const nuevaVacante = await vacante.save();
    
    //redireccionamos 
    res.redirect(`/vacante/${nuevaVacante.url}`);

} 

exports.mostrarVacantes = async (req, res, next)=> {
    const vacantes = await Vancante.findOne({url: req.params.url});

    if(! vacantes) return next();

    res.render('vacante', {
        vacantes,
        nombrePagina,
        barra: true
    })



}