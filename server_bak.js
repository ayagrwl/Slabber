'use-strict'
const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');
const port = process.env.PORT || 3000 ;
const validator = require('express-validator')
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)
const mongoose = require('mongoose')
const flash = require('connect-flash');
const passport = require('passport')
const users = require('./controllers/users.js')()
const socketIO = require('socket.io')

mongoose.promise = global.promise
    
const app = setupExpress();

function setupExpress(){

    const app = express();
    const server = http.createServer(app);
    const io = socketIO(server);
    server.listen(port,function(){
        console.log("Listening to port "+port);
    });

    ConfigureExpress(app);
    
    const router = require('express-promise-router')();
    users.SetRouting(router);
    console.log(router);

    app.use(router);
    return app;
}

console.log(app);

function ConfigureExpress(app){
    require('./passport/passport-local');
    
    app.use(express.static('public'));
    app.set('view engine','ejs');
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended:true}));
    //app.use(validator());
    app.use(session({
        secret : 'kuchbhibhangbhosda',
        resave : true,
        saveUninitialized : true,
        store : new MongoStore({mongooseConnection: mongoose.connection})
    }))
    app.use(flash);
    app.use(passport.initialize());
    app.use(passport.session());
}
