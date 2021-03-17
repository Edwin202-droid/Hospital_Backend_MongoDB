var express = require('express');
var bcrypt = require('bcryptjs');
//Libreria JWT, para crear tokens
var jwt = require('jsonwebtoken');
//config
var SEED = require('../confg/config').SEED;

var app = express();

var Usuario = require('../models/usuario.model');

app.post('/', (req,res)=>{

    var body = req.body;
    //verificamos si el email coincide con el que tenemos en la bd
    Usuario.findOne({email: body.email},(err,usuarioDB)=>{
        if(err){ 
            return response.status(500).json({
                ok: false,
                mensaje:'Error al buscar usuario',
                errors: err
            });
        }
        if(!usuarioDB){ 
            return response.status(500).json({
                ok: false,
                mensaje:'Creedenciales incorrecta - email',
                errors: err
            });
        }
        //email valido, ahora validamos la contraseña, compara
        if(!bcrypt.compareSync(body.password, usuarioDB.password)){
            return response.status(500).json({
                ok: false,
                mensaje:'Creedenciales incorrecta - password',
                errors: err
            });
        }

        //En este punto tenemos usuario y contraseña correctas,
        //Creamos un token
            //libreria jsonwebtoken=> npm 
        usuarioDB.password= ';)'; //no mandar la contraseña en el token, el seed para validar en el backend, secret
        var token = jwt.sign({usuario: usuarioDB}, SEED, {expiresIn: 14400} ) //4horas
        res.status(200).json({
            ok:true,
            usuario:usuarioDB,
            token:token,
            id: usuarioDB._id
        });



    });
    
});

module.exports = app;