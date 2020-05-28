const express = require('express');
const app = express();
const dbIns = require('../models/dbconnection.js');
const user = require('../models/user.js');
const ObjectId = require('mongodb').ObjectId;

app.use(express.json());

// Route for user signup
app.post('/signup', (req, res, next) => {
    const data = req.body;
    dbIns.then((db) => {
        const Users = db.collection('Users');
        // Connecting to database to check if someone else has the same email or username
        Users.find({username: data.username}).toArray((err, items) => {
            if(items.length > 0) res.send({"error": 1, "message": "Username is already taken"});
            else {
                Users.find({email: data.email}).toArray((err, items) => {
                    if(items.length > 0) res.send({"error": 2, "message": "An account is already registered with this email"});
                    else {
                        newUser = new user({
                            username: data.username,
                            fullname: data.fullname,
                            gender: data.gender,
                            country: data.country,
                            email: data.email
                        });
                        // Hashing the user password
                        newUser.password = newUser.encryptPassword(data.password);
                        Users.insertOne(newUser, (err, result) => {
                            res.send({"error": 0, "message": "User added successfully to the database"});
                        });
                    }
                });
            }
        });
    });
});

app.post('/sendrequest', (req, res, next) => {
    const data = req.body;
    dbIns.then((db) => {
        const Users = db.collection('Users');
        Users.find({username: data.findFriend}).toArray((err, items) => {
            if(items.length === 0) res.send({"error": 1, "message": "Your requested user does not exists, please try again"});
            else {
                Users.updateOne({username: data.username}, { $push: { sentRequest: data.findFriend }}, (err, result) => {
                    Users.updateOne({username: data.findFriend}, { $push: {receivedRequest: data.username }}, (err, result) => {
                        res.send({"error": 0, "message": "Friend Request Sent Successfully"});
                    });
                });
            }
        });
    });
});

// Endpoing to accept friend request
app.post('/acceptrequest', (req, res, next) => {
    const data = req.body;
    dbIns.then((db) => {
        const Users = db.collection('Users');
        // Checking if user exists
        Users.find({username: data.requestUsername}).toArray((err, items) => {
            if(items.length === 0) res.send({"error": 1, "message": "User does not exists"});
            else {
                const reqUserId = items[0]._id;
                const friendsList = items[0].friendsList;
                var alreadyFriend = false;
                Users.find({username: data.username}).toArray()
                .then((items) => {
                    console.log(err);
                    const userId = items[0]._id;
                    // Checking if uers are already friends and if not then adding them as friends
                    friendsList.forEach((friend) => {
                        if(JSON.stringify(friend.oid) === JSON.stringify(userId)) alreadyFriend = true;
                    });
                    if(!alreadyFriend) {
                        Users.updateOne({username: data.requestUsername}, { $push: { friendsList: {
                            "$ref": 'User',
                            "$id": new ObjectId(userId),
                            "$db": "test"
                        } } });
                    }
                    alreadyFriend = false;
                    items[0].friendsList.forEach((friend) => {
                        if(JSON.stringify(friend.oid) === JSON.stringify(reqUserId)) alreadyFriend = true;
                    });
                    if(!alreadyFriend) {
                        Users.updateOne({username: data.username}, { $push: { friendsList: {
                            "$ref": 'User',
                            "$id": new ObjectId(reqUserId),
                            "$db": "test"
                        } } });
                    }
                })
                .then((items) => {
                    // Removing requests from both users after successfully adding them as friends
                    Users.updateOne({username: data.username}, { $pull: { receivedRequest: data.requestUsername } })
                    .then((items) => {
                        Users.updateOne({username: data.requestUsername}, { $pull: { sentRequest: data.username } })
                    });
                }).then((items) => {
                    // Sending response to the user
                    if(alreadyFriend) res.send({"error": 0, "message": "Friend Request already Accepted"});
                    else res.send({"error": 0, "message": "Friend Request already Accepted"});
                });
            }
        });
    });
});

module.exports = app;