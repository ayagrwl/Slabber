const express = require('express');
const app = express();
const dbIns = require('../models/dbconnection.js');
const groups = require('../models/groups.js');
const ObjectId = require('mongodb').ObjectId;

app.set('view engine', 'ejs');
app.use(express.json());

// Route to handle chatrooms
app.get('/chatroom/:roomid', (req, res, next) => {
    var roomid = req.params.roomid;
    res.render('../views/chatroom.ejs', {room: roomid, roomName: 'Chat Room '+roomid});
});

// Route to handle private chats
app.get('/chat/:chatid', (req, res, next) => {
    var chatid = req.params.chatid;
    res.render('../views/chat.ejs', {chat: chatid, friendName: 'Friend'});
});

// Create a new chatroom
app.post('/createroom', (req, res, next) => {
    const data = req.body;
    dbIns.then((db) => {
        const Chatrooms = db.collection('Chatrooms');
        const Users = db.collection('Users');
        // Check if username actually exists
        Users.find({username: data.username}).toArray((err, items) => {
            const chatroom = new groups({
                name: data.name,
                admin: {
                    "$ref": 'User',
                    "$id": new ObjectId(items[0]._id),
                    "$db": 'test'
                }
            });
            // Insert the created chatroom on to the database
            Chatrooms.insertOne(chatroom)
            .then((items) => {
                data.members.map((member) => {
                    Users.find({username: member}).toArray((err, items) => {
                        if(items.length > 0) {
                            // Update the memberList array for the chatroom
                            Chatrooms.updateOne({_id: chatroom._id}, { $push: { memberList: {
                                memberId: {
                                    "$ref": 'User',
                                    "$id": new ObjectId(items[0]._id),
                                    "$db": 'test'
                                },
                                memberName: items[0].fullname
                            } } });
                            // Add this chatroom to each member's chatroom list
                            Users.updateOne({username: items[0].username}, { $push: { chatRoomList: {
                                roomId: {
                                    "$ref": 'Chatroom',
                                    "$id": new ObjectId(chatroom._id),
                                    "$db": 'test'
                                },
                                roomName: data.name
                            } } });
                        }
                    });
                });
            });
        });
    });
});

module.exports = app;