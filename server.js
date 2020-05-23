const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const http = require('http');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const mongoose = require('mongoose');
const flash = require('connect-flash');
const passport = require('passport');
const socketIO = require('socket.io');
const _ = require('lodash');
const users = require('./controllers/users.js')()
const expressValidator = require('express-validator');
    
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/slabberdb', {useNewUrlParser: true, useUnifiedTopology: true});

const app = SetupExpress();

function SetupExpress(){
    const app = express();
    const server = http.createServer(app);
    const io = socketIO(server);
    server.listen(process.env.PORT || 3000, function(){
        console.log('Listening on port 3000');
    });
    ConfigureExpress(app);
    
    
    //Setup router
    const router = require('express-promise-router')();
    users.SetRouting(router);
    app.use(router);
    app.use(function(req, res){
        res.render('404');
    });
    return app;
}

function ConfigureExpress(app){
    
    require('./passport/passport-loc');
    
    app.use(express.static('public'));
    app.set('view engine', 'ejs');
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: true}));
    
    app.use(session({
        secret: 'bhangbhosda',
        resave: true,
        saveUninitialized: false,
        store: new MongoStore({mongooseConnection: mongoose.connection})
    }));
    
    app.use(flash());
    
    app.use(passport.initialize());
    app.use(passport.session());
    
    // used in template engine to handle arrays in ejs.
    app.locals._  = _;
}