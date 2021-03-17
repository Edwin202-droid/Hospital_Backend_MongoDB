var express = require('express');

var app = express();




app.get('/',(request, response, next) =>{

    //mandar respuestas a solicitudes. 200= todo correcto
    response.status(200).json({
        ok: true,
        mensaje:'peticion ok'
    });
    
});

module.exports = app;