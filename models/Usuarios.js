const mongosee = require('mongoose');
mongosee.Promise = global.Promise;
const bcrypt = require('bcrypt');

const usuarioSchema = new mongosee.Schema({

    email: {
        type: String,
        unique: true,
        lowercase: true,
        trim: true
    }, 
    nombre: {
        type: String,
        required: 'Agrega tu Nombre'
    },
    password: {
        type: String,
        unique: true,
        required: true,
        trim: true  
    },
    token: String,
    expira: Date,
    imagen: String

});

//metodo para  hashear los password
usuarioSchema.pre('save', async function(next){
    //si el password ya esta hasheado
    if(!this.isModified('password')){
        return next();
    }
    //sino esta hasheado
    const hash = await bcrypt.hash(this.password, 12);
    this.password = hash;
    next();
});

//envia una alerta cuando un usuario esta registrado
usuarioSchema.post('save', function(error, doc, next){
    if(error.name === 'MongoError'  && error.code === 11000){
        next('Este correo ya esta registrado');
    }else{
        next(error);
    }
});

//autenticar usuario
usuarioSchema.methods = {
    compararPassword: function(password) {
        return bcrypt.compareSync(password, this.password);
    }
} 

module.exports = mongosee.model('Usuarios', usuarioSchema);