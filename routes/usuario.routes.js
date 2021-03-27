var express = require('express');
//para encriptar la contraseña; libreria
var bcrypt = require('bcryptjs');

var app = express();

//importar nuestro modelo, para recibir
var Usuario = require('../models/usuario.model');
//Libreria JWT, para crear tokens
var jwt = require('jsonwebtoken');

var mdAutenticacion = require('../middlewares/autenticacion');


//GET = OBTENER TODOS LOS USUARIOS EN LA BD
// '/' esta mos en usuario

app.get('/',(request, response, next) =>{

    var desde= request.query.desde || 0;
    desde=Number(desde);
    //find() => obetenemos todo
    //{} exec => filtramos la consulta
    Usuario.find({ },  'nombre email img role google')
            .skip(desde)
            .limit(5)
            .exec(
        (err,usuarios) => {
        if(err){ 
            return response.status(500).json({
                ok: false,
                mensaje:'Error  usuario',
                errors: err
            });
        }
        //mandar respuestas a solicitudes. 200= todo correcto
        //obtenemos la info de nuestra base de datos y se llena con las condiciones
        //del usuario.model

        Usuario.count({}, (err,conteo)=>{
            response.status(200).json({
                ok: true,
                mensaje:'Get usuarios',
                usuarios,
                total:conteo
                });
        })

    })

    
});

//VERIFICAR TOKEN.
//recibir el token, verificarlo.


//PUT: ACTUALIZAR DATOS, localhost/usuario/usuario.id
app.put('/:id',[mdAutenticacion.verificaToken, mdAutenticacion.verificaADMIN_ROLE_o_mismoUsuario],(req,res)=>{

    var id = req.params.id;
    var body =req.body

    //verificar que el usuario exista con el id
    Usuario.findById( id,(err,usuario)=>{


        if(err){ 
            return response.status(500).json({
                ok: false,
                mensaje:'Error al buscar usuario',
                errors: err
            });
        }
        if(!usuario){
            return response.status(400).json({
                ok: false,
                mensaje:'El usuario con el id' + id + 'no existe',
                errors: err
            });
        }
        //si pasa los dos if, el usuario existe.

        usuario.nombre= body.nombre;
        usuario.email= body.email;
        usuario.role=body.role;

        usuario.save((erro,usuarioGuardado)=>{
            if(err){ 
                return response.status(400).json({
                    ok: false,
                    mensaje:'Error al actualizar usuario',
                    errors: err
                });
            }

            //encriptar la contraseña
            usuarioGuardado.password = ':(';

            res.status(200).json({
                ok: true,
                usuario: usuarioGuardado
            });



        });


    });
    /* res.status(200).json({
        ok: true,
        id:id,
    }); */
});


//POST: CREAR NUEVO USUARIO, cuando creamos el usuario,
//alli debemos encriptar la contraseña
app.post('/' ,(req, res) => {

    var body = req.body
    //definimos que mandamos a la base de datos
    //usando moongose, por eso del faltar nos tirara
    //los errores respectivos
    var usuario= new Usuario({
        nombre: body.nombre,
        email: body.email,
        //encriptar            
        password: bcrypt.hashSync(body.password,10),
        img: body.img,
        role: body.role
    });
    //para guardar
    usuario.save( (err, usuarioGuardado) =>{
        if(err){ 
            return res.status(400).json({
                ok: false,
                mensaje:'Error  al crear usuario',
                errors: err
            });
        }

        // con esto, podemos introducir datos post
        res.status(201).json({
            ok: true,
            usuario: usuarioGuardado,
            //quien hizo los cambios
            usuariotoken: req.usuario
        });
    });


});

//ELIMINAR USUARIO POR EL ID

app.delete('/:id',[mdAutenticacion.verificaToken, mdAutenticacion.verificaADMIN_ROLE_o_mismoUsuario],(req,res)=>{
    //obteniendo el id
    var id= req.params.id;

    Usuario.findByIdAndRemove(id, (err,usuarioBorrado)=>{
        if(err){ 
            return response.status(500).json({
                ok: false,
                mensaje:'Error  al borrar',
                errors: err
            });
        }
        if(!usuarioBorrado){ 
            return response.status(400).json({
                ok: false,
                mensaje:'No existe usuario con ese id',
                errors: err
            });
        }

        // aca borramos
        res.status(200).json({
            ok: true,
            usuario: usuarioBorrado
        });
    })
});


module.exports = app;