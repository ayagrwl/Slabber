const express = require('express');
const app = express();
const dbIns = require('../models/dbconnection.js');
const user = require('../models/user.js');
const jwt = require('jsonwebtoken');
const mailer = require('../helpers/mailer.js');
const token = require('../models/tokens.js');
const ObjectId = require('mongodb').ObjectId;

const privatekey = process.env.KEY || "thisisasecret";

// These 2 (lines 8-9) are required to parse url parameters
const urls = require('url');
const querystring = require('querystring');

app.use(express.json());

// Route for user signup
app.post('/login', (req, res, next) => {
    const data = req.body;
    
    dbIns.then((db) => {
        const Users = db.collection('Users');
        // Login Verification, if token exists then authentication is done instantaneously
        if(!data.token) {
            Users.findOne({email: data.email}).toArray((err, item) => {
                if(item.length === 0){
                    res.send({"error": 3, "message":"User Email Not found"});
                } else {
                    const newUser = new user(item[0]);
                    newUser.isVerified = true;
                    if(!newUser.validUserPassword(data.password)){
                        res.send({"error": 4, "message": "Incorrect Password"});
                    } else if(!newUser.isVerified){
                        res.send({"error": 5, "message": "Email not verified"});
                    } else {
                        res.send({"error": 0, "message": "User authenticated", "token": jwt.sign({
                            email: data.email,
                            username: item[0].username
                        }, privatekey)});
                    }
                }
            });
        } else {
            try {
                const decoded = jwt.verify(data.token, privatekey);
                res.send({"error": 0, "message": "User authenticated"});
            } catch(err) {
                res.send({"error": 1, "message": "Token is invalid"});
            }
        }
    });
});

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
                            const jwtToken = jwt.sign({
                                email: data.email,
                                username: data.username
                            }, privatekey);
                            const newToken = new token({
                                username: data.username,
                                email: data.email,
                                token: jwtToken
                            });
                            const info = mailer.sendMail(newToken).then((items) => {
                                res.send({"error": 0, "message": "User added successfully to the database", "token": jwtToken});
                            });
                        });
                    }
                });
            }
        });
    });
});

// Route for confirming Email
app.get('/confirmation', (req,res,next)=>{
    const parsedUrl = urls.parse(req.url);
    const parsedQs = querystring.parse(parsedUrl.query);
    const user_email = parsedQs.email;
    const token = parsedQs.token;

    if(!token || !user_email) {
        res.send({"error": 1, "message": "User email or token not present"});
    } else {
        // Checking if token is valid
        try {
            const decoded = jwt.verify(token, privatekey);
            if(decoded.email !== user_email) res.send({"error": 3, "message": "Token and email ids are different. Cannot process your request"});
            dbIns.then((db) => {
                const Users = db.collection('Users');
                Users.find({email: user_email}).toArray((err, items) => {
                    if(items.length === 0) res.send({"error": 4, "message": "No such user exists in database"});
                    else {
                        if(decoded.username !== items[0].username) res.send({"error": 3, "message": "Token and email ids are different. Cannot process your request"});
                        else {
                            Users.updateOne({username: decoded.username}, { $set: { isVerified: true } }).then((items) => {
                                res.send({"error": 0, "message": "User was successfully Verified"});
                            });
                        }
                    }
                });
            });
        } catch(err) {
            res.send({"error": 2, "message": "Token is invalid"});
        }
    }
});

// Route to resend confirmation mail
app.post('/resend', (req, res, next)=>{
    const data = req.body;

    try {
        const decoded = jwt.verify(data.token, privatekey);
        dbIns.then((db) => {
            const Users = db.collection('Users');
            Users.find({username: decoded.username}).toArray((err, items) => {
                if(items.length === 0) res.send({"error": 1, "message": "User not found in database"});
                else {
                    const newToken = new token({
                        username: decoded.username,
                        email: decoded.email,
                        token: data.token
                    });
                    const info = mailer.sendMail(newToken).then((items) => {
                        res.send({"error": 0, "message": "Verification email sent"});
                    });
                }
            });
        });
    } catch(err) {
        res.send({"error": 2, "message": "Token is invalid"});
    }
        
});

// Send friend request
app.post('/sendrequest', (req, res, next) => {
    const data = req.body;
    dbIns.then((db) => {
        const Users = db.collection('Users');
        // Checking if user exists
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
                }).then((items) => {
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

app.get('/getfriendlist', (req, res, next) => {
    const data = req.body;
    dbIns.then((db) => {
        const Users = db.collection('Users');
        Users.find({username: data.username}).toArray().then(async (items) => {
            if(items[0].friendsList.length === 0) res.send({"error": 0, "message": "You don't have any friends"});
            else {
                var friends = [];
                for(var i = 0; i < items[0].friendsList.length; i++) {
                    const friend = await Users.find({_id: items[0].friendsList[i].oid}).toArray();
                    friends[i] = {};
                    friends[i].username = friend[0].username;
                    friends[i].fullname = friend[0].fullname;
                }
                res.send({"error": 0, "message": "Here is a list of your friends", "friends": friends});
            }
        });
    });
});

// This api will send info of all the requests sent by the user that are not yet accepted
app.get('/getsentrequests', (req, res, next) => {
    const data = req.body;
    dbIns.then((db) => {
        const Users = db.collection('Users');
        return Users.find({username: data.username}).toArray()
    }).then((item) => {
        res.send({"error": 0, "message": "Here are your sent requests", "sentRequests": item[0].sentRequest});
    });
});

// This api endpoint will send all the received requests not yet accepted by the user
app.get('/getreceivedrequests', (req, res, next) => {
    const data = req.body;
    dbIns.then((db) => {
        const Users = db.collection('Users');
        return Users.find({username: data.username}).toArray()
    }).then((item) => {
        res.send({"error": 0, "message": "These are friend requests sent to you", "receivedRequests": item[0].receivedRequest});
    });
});

module.exports = app;