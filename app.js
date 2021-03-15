
//para crear el servidor express
//conectar la bd con nuestro proyecto de angular

//Requieres, importacion de librerias
/* const { request, response } = require('express'); */
var express = require('express');
var mongoose = require('mongoose');


//Inicializar variables: Usando las librerias
var app = express();


//Conexion a la base de datos
mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB', (err,res)=>{
    if(err) throw err;
    console.log('Base de datos:\x1b[32m%s\x1b[0m', 'online');

});


//Rutas
app.get('/',(request, response, next) =>{

    //mandar respuestas a solicitudes. 200= todo correcto
    response.status(200).json({
        ok: true,
        mensaje:'peticion ok'
    });
    
});


//Escuchar peticiones en el puerto 3000
app.listen(3000, () =>{
        console.log('Express server puerto 3000 \x1b[32m%s\x1b[0m', 'online');
        //\x1b[32m%s\x1b[0m   hace que el online sea de color verde en consolo
});