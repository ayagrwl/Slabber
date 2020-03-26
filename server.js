const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const http = require('http');
const container = require('./container');
const port = process.env.PORT || 3000


container.resolve(function(users){
    const app = setupExpress();

    function setupExpress(){
        const app = express();
        const server = http.createServer(app);
        server.listen(port,function(){
            console.log("Listening to port "+port);
        });

        ConfigureExpress(app);
        
        const router = require('express-promise-router')();
        users.SetRouting(router);

        app.use(router);
    }

    function ConfigureExpress(app){
        app.use(express.static('public'));
        app.set('view engine','ejs');
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({extended:true}));
    }

});













