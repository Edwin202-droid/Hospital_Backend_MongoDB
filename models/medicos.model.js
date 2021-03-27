var mongoose =	require('mongoose');
var Schema =	mongoose.Schema; 

var medicoSchema =	new Schema({
				nombre:  {	type: String,required: [true,	'El	nombre	es	necesario']	},
				descripcion:  {	type: String,required: [true,	'La descripcion es necesaria']	},
				img:     {	type: String,required: false },
				usuario: {	type: Schema.Types.ObjectId, ref: 'Usuario', required: true }
});

module.exports =	mongoose.model('Medico',	medicoSchema);