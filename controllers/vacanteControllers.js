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
    res.redirect(`/vacantes/${nuevaVacante.url}`);

} 

exports.mostrarVacantes = async (req, res, next)=> {
    const vacante = await Vancante.findOne({url:req.params.url})

    if(!vacante) return next();

    res.render('vacante', {
        vacante,
        nombrePagina: vacante.titulo,
        barra: true
    })
}

exports.formEditarVacantes = async (req, res, next)=>{
    const vacante = await Vancante.findOne({url: req.params.url});

    if(!vacante) return next();
    res.render('editar-vacantes',{
        vacante,
        nombrePagina: `Editar - ${vacante.titulo}`,
    })
}

exports.editarVacante = async(req, res)=>{
    const vacateActualizada = req.body;
    vacateActualizada.skills = req.body.skills.split(',');
    
    const vacante = await Vancante.findOneAndUpdate({url: req.params.url}, 
        vacateActualizada, {
            new: true,
            runValidators: true
        });

    res.redirect(`/vacantes/${vacante.url}`); 
}