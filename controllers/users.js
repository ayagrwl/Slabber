'use strict'
const passport = require('passport')
const validator = require('express-validator');

console.log(validator);

module.exports = function(){

    return {
        SetRouting : function(router){
            router.get('/', this.indexPage);
            router.get('/signup', this.getSignUp);
            router.get('/home', this.homePage);

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
            // router.get('/auth/facebook', this.getFacebookLogin);
            // router.get('/auth/facebook/callback', this.facebookLogin);
            // router.get('/auth/google', this.getGoogleLogin);
            // router.get('/auth/google/callback', this.googleLogin);
        },
        printValidation: function(req, res, next) {
            const err = validator.validationResult(req);
            console.log(err);
            const reqErrors = err.array();
            const errors = reqErrors.filter(e => e.msg !== 'Invalid value');
            let messages = [];
            errors.forEach((error) => {
                messages.push(error.msg);
            });
            // req.flash('error', messages);
            req.flash('error', messages);
            return next();
        },
        postLogin: passport.authenticate('local-login', {
            successRedirect: '/home',
            failureRedirect: '/signup',
            failureFlash : true
        }),
        postSignup: passport.authenticate('local-signup', {
            successRedirect: '/home',
            failureRedirect: '/signup',
            failureFlash : true
        }),
        indexPage: function(req, res){
            console.log("/ pr koi aya")
            const errors = req.flash('error');
            return res.render('index', {title: 'Slabber | Login', messages: errors, hasErrors: errors.length > 0});
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

    }
}