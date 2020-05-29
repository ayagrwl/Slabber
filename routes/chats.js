const express = require('express');
const app = express();
const dbIns = require('../models/dbconnection.js');
const groups = require('../models/groups.js');
const privateChat = require('../models/privateChat.js');
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
                name: data.name
            });
            const adminId = items[0]._id;
            // Insert the created chatroom on to the database
            Chatrooms.insertOne(chatroom)
            .then((items) => {
                Chatrooms.updateOne({_id: chatroom._id}, { $set: { admin: {
                    "$ref": 'User',
                    "$id": new ObjectId(adminId),
                    "$db": 'test'
                } } });
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
                            } } }).then((items) => {
                                res.send({"error": 0, "message": "Chatroom created successfully!"});
                            });
                        }
                    });
                });
            });
        });
    });
});

// Create a new private chat
app.post('/createPrivateChat', (req, res, next) => {
    const data = req.body;
    dbIns.then((db) => {
        const privateChats = db.collection('PrivateChats');
        const Users = db.collection('Users');
        // Getting ids of both users and checking if both of them exists
        Users.find({ $or: [ {username: data.username}, {username: data.friendUsername} ] }).toArray((err, items) => {
            if(items.length > 1) {    
                const privatechat = new privateChat();
                privateChats.insertOne(privatechat);
                privateChats.updateOne({_id: privatechat._id}, { $set: {
                    person1: {
                        "$ref": 'User',
                        "$id": items[0]._id,
                        "$db": 'test'
                    },
                    person2: {
                        "$ref": 'User',
                        "$id": items[1]._id,
                        "$db": 'test'
                    }
                } }).then((items) => {
                    // Updating User information by adding the private chat data to their database information
                    Users.updateMany({ $or: [ {username: data.username}, {username: data.friendUsername} ] }, { $push: { privateChats: {
                        "$ref": 'PrivateChat',
                        "$id": privatechat._id,
                        "$db": 'test'
                    } } });
                }).then((items) => {
                    // sending success message
                    res.send({"error": 0, "message": "Private chatroom created, you can now start chatting"});
                });
            // Sending error message if the users does not exist
            } else res.send({"error": 1, "message": "User does not exists"});
        });
    });
});

module.exports = app;