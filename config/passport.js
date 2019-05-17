// this file does the authentication part while user login

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch(error) {
        done(error, null);
    }
});

passport.use('local', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: false
}, async (email, password, done) => {
    try {
      console.log(email);
      console.log(password);
        // 1) Check if the email already exists
        const user = await User.findOne({ 'email': email });
        if (!user) {
          console.log('user not found');
            return done(null, false, { message: 'Email doesn not exists' });
        }
        // 2) Check if the password is correct
        const isValid = await User.comparePasswords(password, user.password);
        if(!isValid){
            console.log('password did not match');
            return done(null, false, { message: 'Please check your password again!' });
        }

        //3) check if account has been verified
        if(!user.active){
          console.log('user is not active');
          //req.flash('success','Email not verified! You need to verifiy your email id. please check your email');
            return done(null, false, { message: 'Email not verified! You need to verifiy your email id. please check your email'});
        }
        console.log(user);
        return done(null, user);


    } catch(error) {
        return done(error, false);
    }
}));
