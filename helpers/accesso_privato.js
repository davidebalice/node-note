//ensureAuthenticated: frequentemente trovi questa dizione; il file che ho chiamato accesso_privato puoi conveniente chiamarlo anche auth.js

module.exports = {
accessoSicuro: function(req , res , next){
if(req.isAuthenticated()){
    return next();
}
req.flash('msg_errore' , 'Non puoi entrare, mi dispiace');
res.redirect('/login');
}
}