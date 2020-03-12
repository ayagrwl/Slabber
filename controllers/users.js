'use strict';
const passport = require('passport');


module.exports = function(_){

    return {
        SetRouting : function(router){
            router.get('/',(req,res)=>{
                return res.render('index');
            }),
            router.get('/signup', (req,res)=>{
                return res.render('signup');
            }),
            router.get('/login', (req,res)=>{
                return res.render('index');
            }),
            router.post('/signup', this.postSignup)
        },
        postSignup: passport.authenticate('local-signup', {
            successRedirect: '/home',
            failureRedirect: '/signup',
            failureFlash : true
        })

    }
}