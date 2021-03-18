var express = require('express');
var bcrypt = require('bcryptjs');
//Libreria JWT, para crear tokens
var jwt = require('jsonwebtoken');
//config
var SEED = require('../confg/config').SEED;

var app = express();
var Usuario = require('../models/usuario.model');

//Google
var CLIENT_ID= require('../confg/config').CLIENT_ID;

const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(CLIENT_ID);

//async -> retorna una promesa, then y catch

//Autenticacion de google-backend npm google-auth

async function verify(token) {

    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: CLIENT_ID,  

    });
    //aqui ya tenemos la info del usuario
    const payload = ticket.getPayload();
    //const userid = payload['sub'];

    //Retornaremos cosas especificas
    return {
        nombre: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    }
  }
//login con google, obtenemos nombre email img
app.post('/google',async(req,res)=>{

    var token= req.body.token;

    //await -> espera a que se cumplca la promesa 
    //de arriba
    var googleUser= await verify (token)
                            .catch(err=>{
                                return res.status(403).json({
                                    ok: false,
                                    mensaje:  'token no valido'
                                });
                            });

        //En googleUser tenemos toda la info que recibiremos
        //ahora lo colocaremos en nuestra bd como usuario registrado
        
        //validar si el correo ya fue introducido anteriormente
        Usuario.findOne({email: googleUser.email},(err, usuarioDB)=>{
            if(err){ 
                return res.status(500).json({
                    ok: false,
                    mensaje:'Error en la BD',
                    errors: err
                });
            }
            //si fue creado por google
            if(usuarioDB){
                if(usuarioDB.google === false){
                    return res.status(500).json({
                        ok: false,
                        mensaje:'Debe usar autenticacion normal',
                        errors: err
                    }); 
                }else{
                    //Creamos n token dentro de la aplicacion
                    var token = jwt.sign({usuario: usuarioDB}, SEED, {expiresIn: 14400} ) //4horas
                    res.status(200).json({
                        ok:true,
                        usuario:usuarioDB,
                        token:token,
                        id: usuarioDB._id
                    });

                }
            }else{
                //El usuario no existe y debe ser creado
                var usuario = new Usuario();

                usuario.nombre= googleUser.nombre;
                usuario.email= googleUser.email;
                usuario.img= googleUser.img;
                usuario.google= true;
                usuario.password= ':)';

                usuario.save((err,usuarioDB)=>{
                    var token = jwt.sign({usuario: usuarioDB}, SEED, {expiresIn: 14400} ) //4horas
                    res.status(200).json({
                        ok:true,
                        usuario:usuarioDB,
                        token:token,
                        id: usuarioDB._id
                    });
                });
            }
        });
        //la logica es al logear con google, recibimos un token
        //para verificar que es de google, ahora con todo esto,
        //mandamos la info para registrarlo en nuestra bd y obtenga su 
        //token para que pueda navegar en la app.



       /*  return res.status(200).json({
            ok:true,
            mensaje: 'ok',
            googleUser: googleUser
        });
 */
});


///Autenticacion normal

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