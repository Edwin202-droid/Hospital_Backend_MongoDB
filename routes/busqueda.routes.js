
//busquedaa por todo, medicos y hospitales
var express = require('express');

var app = express();

//importar modelo hospital
var Hospital = require('../models/hospitales.model');
var Medico = require('../models/medicos.model');
var Usuario = require('../models/usuario.model');

//BUSQUEDA POR COLECCION
app.get('/coleccion/:tabla/:busqueda', (req,res)=>{

    var tabla= req.params.tabla;
    var busqueda= req.params.busqueda;
    var regex = new RegExp(busqueda, 'i');

    var promesa;

    switch(tabla){
        case 'usuarios':
            promesa = buscarUsuario(busqueda, regex);
        break;

        case 'medicos':
            promesa = buscarMedicos(busqueda, regex);
        break;

        case 'hospitales':
            promesa = buscarHospitales(busqueda, regex);
        break;

        default: 
            return res.status(400).json({
                ok:false,
                mensaje: 'Tipo de busqueda invalido'
            });
    }
    //mandaron al correcto
    promesa.then (data =>{
        res.status(200).json({
            ok:true,
            //[] el reesultado de esa busqueda.
            [tabla]: data
        });
    });


});




//BUSQUEDA GENERAL

app.get('/todo/:busqueda',(req, res, next) =>{

    var busqueda = req.params.busqueda;
    //convierte la busqueda en insensible
    var regex = new RegExp(busqueda, 'i');

    //esperamos la respuesta de la funcion buscarHospitales
    //y buscarMedicos, con una promesa

    //Mandar un arreglo de promesas, si todas respondar correcta, recien se dispara (then)
    Promise.all([buscarHospitales(busqueda,regex),
                buscarMedicos(busqueda,regex),
                buscarUsuario(busqueda,regex)])
                .then(respuestas =>{
                    res.status(200).json({
                        ok: true,
                        //por posiciones, hospitas primero -> [0]
                        hospitales:respuestas[0],
                        medicos:respuestas[1],
                        usuarios:respuestas[2]
                    });
                })

});

function buscarHospitales (busqueda, regex){

    return new Promise ((resolve, reject)=>{
        Hospital.find({nombre:regex})
                .populate('usuario','nombre email img') 
                .exec((err, hospitales)=>{
                    if(err){
                        reject('Error al cargar');
                     }else{
                        resolve(hospitales)
                    }
            });
    });
}

function buscarMedicos(busqueda, regex){

    return new Promise ((resolve, reject)=>{
        Medico.find({nombre:regex})
                .populate('usuario', 'nombre email img')
                .populate('hospital')
                .exec( (err, medicos)=>{
                     if(err){
                         reject('Error al cargar');
                    }else{
                        resolve(medicos)
                    }
            });
    });
}

//Busqueda en 2 columnas
function buscarUsuario(busqueda, regex){

    return new Promise ((resolve, reject)=>{
                            //nombres de las propiedades que quiero buscar
        Usuario.find({},'nombre email role img').or([ {'nombre': regex}, {'email':regex} ])
                      .exec((err,usuarios)=>{
                        if(err){
                            reject('Error al cargar usuarios');
                        }else{
                            resolve(usuarios);
                        }
                      });
    });
}

module.exports = app;