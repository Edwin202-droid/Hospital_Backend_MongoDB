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
            return response.status(401).json({
                ok: false,
                mensaje:'token incorrecto',
                errors: err
            });
        }

        req.usuario= decoded.usuario;
        next();
        
    });
}

//VERIFICACION DEL TOKEN

