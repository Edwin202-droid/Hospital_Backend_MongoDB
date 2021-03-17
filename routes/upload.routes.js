var express = require('express');

var fileUpload= require('express-fileupload');

var fs= require('fs');

var app = express();

var Usuario= require('../models/usuario.model');
var Medico= require('../models/medicos.model');
var Hospital= require('../models/hospitales.model');

//default
app.use(fileUpload());

//USAREMOS UN PUT PORQUE EL USUARIO YA ESTA CREADO
//SOLO FALTARIA INGRESAR UNA FOTO
//en el postman: form-data
//libreria express-fileupload

app.put('/:tipo/:id',(req, res, next) =>{

    var tipo= req.params.tipo;
    var id = req.params.id;
    //tipos de coleccion
    var tiposValidos = ['hospitales','medicos','usuarios'];
    if(tiposValidos.indexOf(tipo) < 0){
        return res.status(400).json({
            ok: false,
            mensaje:'Tipo- Coleccion no valida',
            errors: err
        });
    }

    //si vienen archivos
    if(!req.files){
            return res.status(400).json({
                ok: false,
                mensaje:'No selecciono ninguna imagen',
                errors: err
            });
    }
    //Obtener nombre del archivo
    var archivo = req.files.imagen;
    //cortar el nombre, por los puntos. nombre.jpg => nombre / jpg 
    var nombreCortado= archivo.name.split('.');
    //ultima posicion para saber la extension
    var extensionArchivo= nombreCortado[nombreCortado.length -1];
    //solo extensiones de imagen

    var extensionesValidas = ['png', 'jpg','gif','jpeg'];
    //ahora saber que la extension exista dentro de los validos

    if (extensionesValidas.indexOf(extensionArchivo) < 0){
        return res.status(400).json({
            ok: false,
            mensaje:'Extension no valida',
            errors: {message: 'las extensiones validas son'+ extensionesValidas.join(', ')}
        });
    }
    //aqui ya se confirma que es una imagen valida
    //nombre archivo personalizado, hacer que por mas que se repita
    //la imagen, dentro del sistema siempre sera distinto

    var nombreArchivo= `${id}-${new Date().getMilliseconds()}.${extensionArchivo}`;

    // Mover el archivo del temporal a un path
    // <--- la carpeta uploads
    var path = `./uploads/${tipo}/${nombreArchivo}`;
    //Mover al path
    archivo.mv(path,err =>{
        if(err){
            return res.status(500).json({
                ok: false,
                mensaje:'Error al mover archivo',
                errors: err
            });
        }

        subirPorTipo(tipo,id,nombreArchivo,res);

         /* //se movio correctamente
        res.status(200).json({
            ok: true,
            mensaje:'archivo movido',
            extensionArchivo
        }); */
    })
});


function subirPorTipo(tipo,id,nombreArchivo,res){
    //Usuario
    if(tipo ==='usuarios'){
        Usuario.findById(id,(err,usuario)=>{

            if(!usuario){
                return res.status(400).json({
                    ok: true,
                    mensaje:'usuario no existe',
                    errors:{message:'Usuario no existe'}
                });
            }

            //obtenemos la direccion de la imagem
            var pathViejo = './uploads/usuarios/' + usuario.img;
            //si existe una imagen, la sacamos
            if(fs.existsSync(pathViejo)){
                fs.unlinkSync(pathViejo);
            }

            usuario.img = nombreArchivo;

            usuario.save((err,usuarioActualizado)=>{

                //usuarioActualizado.password=';)';

                return res.status(200).json({
                    ok: true,
                    mensaje:'imagen de usuario actualizado',
                    usuario: usuarioActualizado
                });
            });

        });
    }
    if(tipo ==='medicos'){

        Medico.findById(id,(err,medico)=>{

            if(!medico){
                return res.status(400).json({
                    ok: true,
                    mensaje:'medico no existe',
                    errors:{message:'medico no existe'}
                });
            }

            //obtenemos la direccion de la imagem
            var pathViejo = './uploads/medicos/' + medico.img;
            //si existe una imagen, la sacamos
            if(fs.existsSync(pathViejo)){
                fs.unlinkSync(pathViejo);
            }

            medico.img = nombreArchivo;

            medico.save((err,medicoActualizado)=>{

                return res.status(200).json({
                    ok: true,
                    mensaje:'imagen de medico actualizado',
                    medico: medicoActualizado
                });
            })

        });
    }
    if(tipo ==='hospitales'){

        Hospital.findById(id,(err,hospital)=>{

            if(!hospital){
                return res.status(400).json({
                    ok: true,
                    mensaje:'hospital no existe',
                    errors:{message:'hospital no existe'}
                });
            }
            //obtenemos la direccion de la imagem
            var pathViejo = './uploads/hospitales/' + hospital.img;
            //si existe una imagen, la sacamos
            if(fs.existsSync(pathViejo)){
                fs.unlinkSync(pathViejo)
            }

            hospital.img = nombreArchivo;

            hospital.save((err,hospitalActualizado)=>{
                
                return res.status(200).json({
                    ok: true,
                    mensaje:'imagen de hospital actualizado',
                    hospital: hospitalActualizado
                });
            })

        });
    }
}




module.exports = app;