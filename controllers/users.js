'use strict'
const passport = require('passport')
const validator = require('express-validator');
const urls = require('url');
const querystring = require('querystring');
const User = require('../models/user');
const Token = require('../models/tokens');
const mailer = require('../helpers/mailer');

module.exports = function(){

    return {
        SetRouting : function(router){
            router.get('/', this.indexPage);
            router.get('/signup', this.getSignUp);
            router.get('/home', this.homePage);
            router.get('/confirmation', this.confirmEmail);
            router.get('/*', this.Kachra);

            // Validator.check checks the complete req for the information. To reduce load, u can do validator.body or validator.header
            router.post('/', [
                validator.check('email').not().isEmpty().isEmail().withMessage("Invalid Email"),
                validator.check('password').not().isEmpty().isLength({min:5}).withMessage("Too short Password!"),
            ], this.printValidation, this.postLogin);
            router.post('/signup',[
                validator.check('username').not().isEmpty().isLength({min:5}).withMessage("Invalid Username"),
                validator.check('email').not().isEmpty().isEmail().withMessage("Invalid Email"),
                validator.check('password').not().isEmpty().isLength({min:5}).withMessage("Too short Password!"),
            ], this.printValidation, this.postSignup);
            router.post('resend', this.sendConfirmationEmail);
            
            // router.get('/auth/facebook', this.getFacebookLogin);
            // router.get('/auth/facebook/callback', this.facebookLogin);
            // router.get('/auth/google', this.getGoogleLogin);
            // router.get('/auth/google/callback', this.googleLogin);
        },
        printValidation: function(req, res, next) {
            const err = validator.validationResult(req);
            const reqErrors = err.array();
            const errors = reqErrors.filter(e => e.msg !== 'Invalid value');
            let messages = [];
            
            errors.forEach((error) => {
                messages.push(error.msg);
            });
            // req.flash('error', messages);
            if(messages.length > 0){
                req.flash('error', messages);
                res.redirect(req.url);
            } else {
                return next();
            }
        },
        postLogin: passport.authenticate('local-login', {
            successRedirect: '/home',
            failureRedirect: '/',
            failureFlash : true
        }),
        postSignup: passport.authenticate('local-signup', {
            successRedirect: '/home',
            failureRedirect: '/signup',
            failureFlash : true
        }),
        confirmEmail: function(req,res){
            let parsedUrl = urls.parse(req.url);
            let parsedQs = querystring.parse(parsedUrl.query);
            let user_email = parsedQs.email;
            let tok = parsedQs.tok;
            if(!email || !token){
                req.flash('error', "Missing String Credentials");
                res.redirect('/');
            }
            Token.findOne({email:user_email}, (err,stored_token)=>{
                if(err){
                    req.flash('error', "Token Expired or unavailable");
                    res.redirect('/');
                }
                if(stored_token.token === tok){
                    const res = Person.updateOne({email:user_email}, {isVerified: true});
                    req.flash('error', "Email Verified Successfully");
                    res.redirect('/');
                } else {
                    req.flash('error', "Parameters Do not Match");
                    res.redirect('/');
                }

            })
            
            //console.log(parsedQs.email);
        },
        sendConfirmationEmail: function(){
            let user_email = req.body(email);
            Token.findOne({email : user_email}, (err,tok)=>{
                if(err){
                    // token epired.
                    var newToken = new Token({
                        username: req.body.username,
                        email: req.body.email,
                        token: crypto.randomBytes(16).toString('hex')
                    }); 
                    token.save((err)=>{
                        var info = mailer.sendMail(req.body.email,newToken);
                        console.log(info);
                    });
                } else {
                    var info = mailer.sendMail(tok.email,tok.token);
                }
            })
        },
        indexPage: function(req, res){
            console.log("/ pr koi aya")
            const errors = req.flash('error');
            const notifs = req.flash('notif');
            return res.render('index', {title: 'Slabber | Login', messages: errors, hasErrors: errors.length > 0, notifications:notifs });
        },
        getSignUp: function(req, res){
            console.log("/signup pr koi aya")
            const errors = req.flash('error');
            return res.render('signup', {title: 'Slabber | SignUp', messages: errors, hasErrors: errors.length > 0});
        },
        homePage: function(req,res){
            console.log("/home pr koi aya")
            return res.render('home');
        },
        Kachra: function(req,res){
            return res.render('test', {title: req.url+" page exist nhi krta !!"})
        },

    }
}