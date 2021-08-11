const mongoose = require('mongoose');
const Vancante = mongoose.model('vacante');
const {body,validationResult} = require('express-validator');
const multer = require('multer');
const shortid = require('shortid');

exports.formularioVacantes = (req, res)=>{
    res.render('nueva-vacante',{
        nombrePagina: 'Nueva Vacante',
        tagLine: 'Llena el Formulario y publica Vacantes',
        cerrarSesion: true,
        nombre: req.user.nombre,
        imagen: req.user.imagen
    });
}

//agregar una nueva vacante a la BD
exports.agregarVacante = async (req, res)=>{
    const vacante = new Vancante(req.body);

    //usuario autor de la vacantes
    vacante.autor = req.user._id;



    //crear arreglos para nuestros skills

    vacante.skills = req.body.skills.split(',');
    //almacenar en la bd
    const nuevaVacante = await vacante.save();
    
    //redireccionamos 
    res.redirect(`/vacantes/${nuevaVacante.url}`);

} 

exports.mostrarVacantes = async (req, res, next)=> {
    const vacante = await Vancante.findOne({url:req.params.url}).populate('autor');
     

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
        cerrarSesion: true,
        nombre: req.user.nombre
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

//validar y sanitizar los campos de las nuevas vacantes
exports.validarVacantes = async(req, res, next)=>{
    const rol = [
        body('titulo').not().isEmpty().withMessage('Agrega un titulo a la vacante').escape(),
        body('empresa').not().isEmpty().withMessage('Agrega una Empresa').escape(),
        body('ubicacion').not().isEmpty().withMessage('Agrega una Ubicacion').escape(),
        body('contrato').not().isEmpty().withMessage('Agrega un Contrato').escape(),
        body('skills').not().isEmpty().withMessage('Agrega almenos una habilidad').escape()
    ]
    await Promise.all(rol.map(validation => validation.run(req)));
    const errores = validationResult(req);

    if(!errores.isEmpty()){
        req.flash('error', errores.array().map(error => error.msg));
        
        res.render('nueva-vacante',{
            nombrePagina: 'Nueva Vacante',
            tagLine: 'Llena el Formulario y publica Vacantes',
            cerrarSesion: true,
            nombre: req.user.nombre,
            mensajes: req.flash()
        })
    }
    //siguiente middleware
    next();
    
}

exports.eliminarVacantes = async(req, res, next)=>{

    const { id } = req.params;
    const vacante = await Vancante.findById(id)
    

    if(verificarAutor(vacante, req.user)){
        vacante.remove();
        res.status(200).send('Vacantes eliminada correctamente');
    }else{
        res.status(403).send('eror');
    }
    
}
const verificarAutor = (vacante = {}, usuario ={})=>{
    if(!vacante.autor.equals(usuario._id)){
        return false
    }
    return true;

}

exports.subirCV = (req, res, next)=>{

    upload(req, res, function(error){
        if(error){
            //si el error es de multer cae en este if
            //sino pasa al siguente evaluacion
            if(error instanceof multer.MulterError){
                if(error.code === 'LIMIT_FILE_SIZE'){
                    req.flash('El archivo es muy grande: Maximo 600KB');
                }else{
                    req.flash('error', error.message);
                }
            }else{
                req.flash('error', error.message)
            }
            res.redirect('back')
            return;
        }else{
            return next();
        }
    });
}

//cofiguracion de multer
const configuracionMulter = {

    storage: fileStorage = multer.diskStorage({
        destination: (req, res, cb)=>{
            cb(null, __dirname+'../../public/uploads/cv');
        },
        filename: (req, file, cb)=>{
            const extension =   file.mimetype.split('/')[1];
            cb(null, `${shortid.generate()}.${extension}`);
        }
    }),
    fileFilter(req, file, cb){
        if(file.mimetype === 'application/pdf'){
            //el callback se ejecuta como true o false : true la imagene es correcta
            cb(null, true)
        }else{
            cb(new Error('Formato no valido'), false)
        }
    },
    limits: {fileSize: 100000}
}

const upload = multer(configuracionMulter).single('cv');


exports.contactar = async(req, res, next)=>{
    const vacante = await Vancante.findOne({url: req.params.url});
    //sino existe la vacante
    if(!vacante) return next();

    //ok

    const nuevoCandidato = {
        nombre: req.body.nombre,
        email: req.body.email,
        cv: req.file.filename
    }

    //alamcenar vacante
    vacante.candidatos.push(nuevoCandidato);
    await vacante.save();
    //mensaje y redireccionamos
    req.flash('correcto', 'Se envio tu Curiculum Correctamente');
    res.redirect('/')
}


exports.mostrarCandidatos = async(req, res, next)=>{
    const vacante = await Vancante.findById(req.params.id);

    if(vacante.autor != req.user._id.toString()){
        return next();
    } 
    if (!vacante) return next();

    res.render('candidatos',{
        nombrePagina : `Candidatos Vacante - ${vacante.titulo}`,
        cerrarSesion: true,
        nombre: req.user.nombre,
        imagen : req.user.imagen,
        candidatos: vacante.candidatos
    });
}

//buscador de vacante

exports.buscarVacantes = async(req, res)=>{
    const vacantes = await Vancante.find({
        $text:{
            $search: req.body.q
        }
    });

    //mostrar vacantes
    res.render('home',{
        nombrePagina: `resultado de la busquedad : ${req.body.q}`,
        barra: true,
        vacantes
    })
}