const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UtentiSchema =  new Schema({
nome:{
    type: String,
    required: true
},
cognome:{
    type: String,
    required: true
},
email:{
type: String,
required: true
},
password:{
    type: String,
    required: true
    },
data:{
    type: Date,
    default: Date.now
}
})

mongoose.model('utenti' , UtentiSchema);