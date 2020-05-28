const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

// Required collections must have in database
const collections = ['Users', 'Chatrooms', 'PrivateChats'];

// Importing created routes
const chatRoutes = require('./routes/chats.js');
const userRoutes = require('./routes/user.js');

const dbIns = require('./models/dbconnection.js');

dbIns.then((db) => {
    console.log('Database connected');
    // Checks if all the necessary collections are present in the mongodb database
    collections.forEach((collection) => {
        db.listCollections({name: collection}).toArray((err, items) => {
            if(items.length == 0) {
                db.createCollection(collection, (err, res) => {
                    console.log(`Collection ${collection} Created`);
                });
            } else {
                console.log(`Collection ${collection} already Present`);
            }
        });
    });
});

// Importing created socket events
require('./socket/groupchat.js')(io);

// Mounting routes on the app
app.use('/', chatRoutes);
app.use('/', userRoutes);

const PORT = 3000 || process.env.PORT;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));