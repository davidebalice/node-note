const LocalStrategy  = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

//SCHEMA E MODELLO PER UTENTI
require('../models/utenti');
const Utenti = mongoose.model('utenti');

module.exports = function(passport){
  passport.use(new LocalStrategy({usernameField: 'email'}, (email, password, done) => {
    // Match user
    Utenti.findOne({
      email:email
    }).then(utente => {
      if(!utente){
        return done(null, false, {message: 'Utente non trovato'});
      } 

      // Match password
      bcrypt.compare(password, utente.password, (err, isMatch) => {
        if(err) throw err;
        if(isMatch){
          return done(null, utente);
        } else {
          return done(null, false, {message: 'password non corretta'});
        }
      })
    })
  }));

  passport.serializeUser(function(utente, done) {
    done(null, utente.id);
  });
  
  passport.deserializeUser(function(id, done) {
    Utenti.findById(id, function(err, utente) {
      done(err, utente);
    });
  });
}