
//importar el mongoose
var mongoose = require('mongoose');
    //para validar: no se repitan datos => npm 
var uniqueValidator = require('mongoose-unique-validator');

//definir esquemas
var Schema = mongoose.Schema;

//para validar roles
var rolesValidos ={
    values: ['ADMIN_ROLE','USER_ROLE'],
    messsage: '{VALUE} no es un rol permitido'
};

var usuarioSchema = new Schema({
    //decimos como recibimos la tabla de usuario de la bd, si falla vota un error
    //es requerido, del no colocarlo salta el erro
    nombre: {type: String, required: [true, 'El nombre es necesario'] },
    //debe ser unico
    email: {type: String, unique:true, required: [true, 'El correo es necesario'] },
    password: {type: String, required: [true, 'La contraseña es necesario'] },
    img: {type: String, required: false},
    //enum: poner la validacion de roles
    role: {type: String, required: true, default: 'USER_ROLE', enum: rolesValidos}

});

//para que nos muestre el error, "email ya existe", por ejemplo
usuarioSchema.plugin(uniqueValidator, { message: '{PATH} debe ser unico' });

//usar el modelo afuera, exportar
module.exports = mongoose.model('Usuario', usuarioSchema);