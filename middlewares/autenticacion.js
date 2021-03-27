//Libreria JWT, para crear tokens
var jwt = require('jsonwebtoken');
//config
var SEED = require('../confg/config').SEED;

 
//VERIFICACION DEL TOKEN

exports.verificaToken = function (req, res, next){
    //leer el token
    var token = req.query.token;
    //verificar validez
    jwt.verify(token, SEED, (err,decoded) =>{
        if(err){
            return res.status(401).json({
                ok: false,
                mensaje:'token incorrecto',
                errors: err
            });
        }

        req.usuario= decoded.usuario;
        next();
        
    });
}

//VERIFICACION ADMIN
exports.verificaADMIN_ROLE_o_mismoUsuario = function (req, res, next){
    
    var usuario = req.usuario;
    //para que el usuario pueda actualizarse aunque no sea admin
    var id= req.params.id;

    //Si el el rol de usuario es admin O si el id del usuario coincide con el id 
    if(usuario.role === 'ADMIN_ROLE' || usuario._id === id){
        next();
        return;
    }else{
        return res.status(401).json({
            ok: false,
            mensaje:'token incorrecto - No es administrador, ni es el mismo usuario',
            errors: {message: 'No es administrador'}
        });
    }

    //Implementarlo en actualizar usuario, borrar
}


