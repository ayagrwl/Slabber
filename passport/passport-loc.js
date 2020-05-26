'use strict';

const passport = require('passport');
const User = require('../models/user');
const LocalStrategy = require('passport-local').Strategy;
const mailer = require('../helpers/mailer')
const Token = require('../models/tokens')

passport.serializeUser((user,done)=>{
    done(null,user.id);
})
passport.deserializeUser((id,done)=>{
    User.findById(id,(err,user)=>{
        done(err,user);
    });
});

passport.use('local-signup',new LocalStrategy({
    usernameField:'email',
    passwordField:'password',
    passReqToCallback:true
    }, (req,email,password,done)=>{
    User.findOne({'email':email}, (err,user)=>{
        if(err){
            return done(err);
        }
        if(user){
            return done(null,false, req.flash('error', 'User email already Exists')); 
        }

        const newUser = new User({
            username : req.body.username,
            email : req.body.email,
            password : newUser.encryptPassword(req.body.password)
        });
        newUser.save((err)=>{
            var newToken = new Token({
                username: req.body.username,
                email: req.body.email,
                token: crypto.randomBytes(16).toString('hex')
            }); 
            token.save((err)=>{
                var info = mailer.sendMail(newToken);
                console.log(info);
            });
            done(null,newUser);
        })
    })

}))

passport.use('local-login',new LocalStrategy({
    usernameField:'email',
    passwordField:'password',
    passReqToCallback:true
    }, (req,email,password,done)=>{
        User.findOne({'email':email}, (err,user)=>{
            if(err){
                return done(err)
            }
            if(!user){
                done(null,false,req.flash('error',"Email does not exist"));
            }
            if(!user.validPassword(password)){
                done(null,false,req.flash('error',"Incorrect Password"));
            }
            if(!user.isVerified){
                done(null,false,req.flash('error',"This Account has not been Verified."));
            }
            return done(null,user);            
        });

}));

// passport.use('check-check',new LocalStrategy({
//     usernameField: 'email',
//     passwordField: 'email',
//     passReqToCallback: true
//     },(req, username, password, done)=>{
            /*check if token exists in the db for the given email, then verify the values*/ 
// }));


