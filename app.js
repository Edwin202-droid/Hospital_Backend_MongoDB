
//para crear el servidor express
//conectar la bd con nuestro proyecto de angular

//Requieres, importacion de librerias
/* const { request, response } = require('express'); */
var express = require('express');
var mongoose = require('mongoose');
//importar libreria body parser, para hacer el post
var bodyParser = require('body-parser');

//Inicializar variables: Usando las librerias
var app = express();


//body parser: configuracion
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())

//CORS
app.use(function(req,res,next){
    res.header("Access-Control-Allow-Origin","*");
    res.header("Access-Control-Allow-Headers","Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS")
    next();
});


//Rutas
//lo movimos
//Importar rutas
var appRoutes = require ('./routes/app.routes');
var usuarioRoutes = require ('./routes/usuario.routes');
var hospitalesRoutes = require ('./routes/hospitales.routes');
var medicosRoutes= require('./routes/medicos.routes');
var loginRoutes= require('./routes/login.routes');
var busquedaRoutes= require('./routes/busqueda.routes');
var uploadRoutes= require('./routes/upload.routes');
var imagenesRoutes= require('./routes/imagenes.routes');

//Conexion a la base de datos
mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB', (err,res)=>{
    if(err) throw err;
    console.log('Base de datos:\x1b[32m%s\x1b[0m', 'online');

});



//Rutas de app.rouetes- minddleware
app.use('/usuario',usuarioRoutes);
app.use('/hospitales',hospitalesRoutes);
app.use('/medicos',medicosRoutes);
app.use('/login',loginRoutes);
app.use('/busqueda',busquedaRoutes);
app.use('/upload',uploadRoutes);
app.use('/img',imagenesRoutes);

app.use('/',appRoutes);


//Escuchar peticiones en el puerto 3000::en pantalla
app.listen(3000, () =>{
        console.log('Express server puerto 3000 \x1b[32m%s\x1b[0m', 'online');
        //\x1b[32m%s\x1b[0m   hace que el online sea de color verde en consolo
});