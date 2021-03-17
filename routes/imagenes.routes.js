
//mostrar imagen

var express = require('express');

var app = express();
//librerias necesarias para mostrar imaggen
const path = require('path');
const fs = require('fs');


app.get('/:tipo/:img',(req, res, next) =>{

    var tipo = req.params.tipo;
    var img = req.params.img;

    //para  obtener el path de la imagen
    var pathImagen = path.resolve(__dirname, `../uploads/${tipo}/${img}`);

    //si existe imagen muestra
    if(fs.existsSync(pathImagen)){
        res.sendFile(pathImagen);
    }else{
        //si no existe, muestra la imagen no_imagen
        var pathNoImagen= path.resolve(__dirname, '../assets/no-img.jpg');
        res.sendFile(pathNoImagen);
    }
/* 
    //mandar respuestas a solicitudes. 200= todo correcto
    res.status(200).json({
        ok: true,
        mensaje:'peticion ok'
    }); */
    
});

module.exports = app;