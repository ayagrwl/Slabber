const express = require('express');
const app = express();
const dbIns = require('../models/dbconnection.js');
const user = require('../models/user.js');

app.use(express.json());

// Route for user signup
app.post('/signup', (req, res, next) => {
    const data = req.body;
    dbIns.then((db) => {
        // Connecting to database to check if someone else has the same email or username
        db.collection('Users').find({username: data.username}).toArray((err, items) => {
            if(items.length > 0) res.send({"error": 1, "message": "Username is already taken"});
            else {
                db.collection('Users').find({email: data.email}).toArray((err, items) => {
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
                        db.collection('Users').insertOne(newUser, (err, result) => {
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
        db.collection('Users').find({username: data.findFriend}).toArray((err, items) => {
            if(items.length === 0) res.send({"error": 1, "message": "Your requested user does not exists, please try again"});
            else {
                db.collection('Users').updateOne({username: data.username}, { $push: { sentRequest: data.findFriend }}, (err, result) => {
                    db.collection('Users').updateOne({username: data.findFriend}, { $push: {receivedRequest: data.username }}, (err, result) => {
                        res.send({"error": 0, "message": "Friend Request Sent Successfully"});
                    });
                });
            }
        });
    });
});

module.exports = app;