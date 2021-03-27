
var express = require('express');

var app = express();

var Medico = require('../models/medicos.model');

var mdAutenticacion = require('../middlewares/autenticacion');

//GET:Mostrar medicos

app.get('/',(request, response, next) =>{

    var desde = request.query.desde || 0;
    desde=Number(desde);

    Medico.find({ })
        .skip(desde)
        .limit(5)
        //mostrar solo el usuario que lo asigno
        .populate('usuario','nombre email')
        //mostrar hospital asignado
        .populate('hospital')
        .exec((err,medicos) => {
        if(err){ 
            return response.status(500).json({
                ok: false,
                mensaje:'Error  medicos',
                errors: err
            });
        }
        Medico.count({},(error,conteo)=>{
                response.status(200).json({
                ok: true,
                mensaje:'Get medicos',
                medicos,
                total:conteo
                });
        })
    });
  
});

//Obtener un solo Medico
app.get('/:id',(req,res)=>{
    var id = req.params.id;
    
    //finbyid -> obteniendo por id
    Medico.findById(id)
        .populate('usuario','nombre email img')
        .populate('hospital')
        .exec((err,medico)=>{
            if(err){ 
                return response.status(500).json({
                    ok: false,
                    mensaje:'Error al buscar medico',
                    errors: err
                });
            }
            if(!medico){
                return response.status(400).json({
                    ok: false,
                    mensaje:'El medico con el id' + id + 'no existe',
                    errors: err
                });
            }
            res.status(200).json({
                ok:true,
                medico:medico
            });
        })
});

//PUT: Actualizar datos de medicos
app.put('/:id',mdAutenticacion.verificaToken,(req,res)=>{

    var id = req.params.id;
    var body =req.body

    //verificar que el medico exista con el id
    Medico.findById( id,(err,medico)=>{
        if(err){ 
            return response.status(500).json({
                ok: false,
                mensaje:'Error al buscar medico',
                errors: err
            });
        }
        if(!medico){
            return response.status(400).json({
                ok: false,
                mensaje:'El medico con el id' + id + 'no existe',
                errors: err
            });
        }
        //si pasa los dos if, el hospital existe.

        medico.nombre= body.nombre;
        //actualizar el usuario que lo modifico
        medico.usuario= req.usuario._id;
        medico.hospital= body.hospital;

        medico.save((err,medicoGuardado)=>{
            if(err){ 
                return response.status(400).json({
                    ok: false,
                    mensaje:'Error al actualizar medico',
                    errors: err
                });
            }
            res.status(200).json({
                ok: true,
                medico: medicoGuardado
            });
        });
    });
});

//POST: Crear nuevo medico.
app.post('/',mdAutenticacion.verificaToken , (req, res) => {

    var body = req.body
    var medico= new Medico({
        nombre: body.nombre,
        usuario:req.usuario._id,
        hospital:body.hospital
    });

    //para guardar
    medico.save( (err, medicoGuardado) =>{
        if(err){ 
            return response.status(400).json({
                ok: false,
                mensaje:'Error  al crear medico',
                errors: err
            });
        }
        // con esto, podemos introducir datos post
        res.status(201).json({
            ok: true,
            medico: medicoGuardado
        });
    });
});

//DELETE: BORRAR HOSPITAL
app.delete('/:id',mdAutenticacion.verificaToken,(req,res)=>{
    //obteniendo el id
    var id= req.params.id;

    Medico.findByIdAndRemove(id, (err,medicoBorrado)=>{
        if(err){ 
            return response.status(500).json({
                ok: false,
                mensaje:'Error  al borrar',
                errors: err
            });
        }
        if(!medicoBorrado){ 
            return response.status(400).json({
                ok: false,
                mensaje:'No existe medico con ese id',
                errors: err
            });
        }

        // aca borramos
        res.status(200).json({
            ok: true,
            medico: medicoBorrado
        });
    });
});


module.exports = app;