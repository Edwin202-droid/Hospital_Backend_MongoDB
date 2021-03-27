
var express = require('express');

var app = express();

var Hospitales = require('../models/hospitales.model');

var mdAutenticacion = require('../middlewares/autenticacion');

//GET:Mostrar hospitales

app.get('/',(request, response, next) =>{

    var desde = request.query.desde || 0;
    desde=Number(desde);

    Hospitales.find({ })
        .skip(desde)
        .limit(5)
        //para que salga que usuario creo dicho hospital
        .populate('usuario','nombre email')
        .exec((err,hospitales) => {
        if(err){ 
            return response.status(500).json({
                ok: false,
                mensaje:'Error  hospitales',
                errors: err 
            });
        }

        Hospitales.count({},(error,conteo)=>{
                response.status(200).json({
                ok: true,
                mensaje:'Get hospitales',
                hospitales, 
                total:conteo
                });
        })

    });
  
});

//GET: Buscar hospitales por ID
app.get('/:id', (req, res) => {
    var id = req.params.id;
    Hospitales.findById(id)
        .populate('usuario', 'nombre img email')
        .exec((err, hospital) => {
             if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar hospital',
                    errors: err
                });
            }
            if (!hospital) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'El hospital con el id ' + id + 'no existe',
                    errors: { message: 'No existe un hospital con ese ID' }
                });
            }
            res.status(200).json({
            ok: true,
            hospital: hospital
            });
        })
})

//PUT: Actualizar datos de hospitales
app.put('/:id',mdAutenticacion.verificaToken,(req,res)=>{

    var id = req.params.id;
    var body =req.body

    //verificar que el hospital exista con el id
    Hospitales.findById( id,(err,hospital)=>{
        if(err){ 
            return res.status(500).json({
                ok: false,
                mensaje:'Error al buscar hospital',
                errors: err
            });
        }
        if(!hospital){
            return res.status(400).json({
                ok: false,
                mensaje:'El hospital con el id' + id + 'no existe',
                errors: err
            });
        }
        //si pasa los dos if, el hospital existe.

        hospital.nombre= body.nombre;
        //actualizar el usuario que lo modifico
        hospital.usuario= req.usuario._id;

        hospital.save((err,hospitalGuardado)=>{
            if(err){ 
                return res.status(400).json({
                    ok: false,
                    mensaje:'Error al actualizar hospital',
                    errors: err
                });
            }
            res.status(200).json({
                ok: true,
                hospital: hospitalGuardado
            });
        });
    });
});

//POST: Crear nuevo hospital.
app.post('/',mdAutenticacion.verificaToken , (req, res) => {

    var body = req.body
    var hospital= new Hospitales({
        nombre: body.nombre,
        usuario:req.usuario._id
    });
    
    //para guardar
    hospital.save( (err, hospitalGuardado) =>{
        if(err){ 
            return res.status(400).json({
                ok: false,
                mensaje:'Error  al crear hospital',
                errors: err
            });
        }
        // con esto, podemos introducir datos post
        res.status(201).json({
            ok: true,
            hospital: hospitalGuardado,
            
        });
    });
});

//DELETE: BORRAR HOSPITAL
app.delete('/:id',mdAutenticacion.verificaToken,(req,res)=>{
    //obteniendo el id
    var id= req.params.id;

    Hospitales.findByIdAndRemove(id, (err,hospitalBorrado)=>{
        if(err){ 
            return response.status(500).json({
                ok: false,
                mensaje:'Error  al borrar',
                errors: err
            });
        }
        if(!hospitalBorrado){ 
            return response.status(400).json({
                ok: false,
                mensaje:'No existe hospital con ese id',
                errors: err
            });
        }

        // aca borramos
        res.status(200).json({
            ok: true,
            hospital: hospitalBorrado
        });
    })
});


module.exports = app;