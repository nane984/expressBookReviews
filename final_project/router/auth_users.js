const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
    // Filter the users array for any user with the same username
    let userswithsamename = users.filter((user) => {
        return user.username === username;
    });
    // Return true if any user with the same username is found, otherwise false
    if (userswithsamename.length > 0) {
        return false;
    } else {
        return true;
    }
}

const authenticatedUser = (username,password)=>{ //returns boolean
    // Filter the users array for any user with the same username and password
    let validusers = users.filter((user) => {
        return (user.username === username && user.password === password);
    });
    // Return true if any valid user is found, otherwise false
    if (validusers.length > 0) {
        return true;
    } else {
        return false;
    }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    // Check if username or password is missing
    if (!username || !password) {
        return res.status(404).json({ message: "Error logging in" });
    }

    if(authenticatedUser(username, password)){
        // Generate JWT access token
        let accessToken = jwt.sign({data: username}, 'access', {expiresIn: 60*60});

        // Store access token and username in session
        req.session.authorization = {accessToken, username}

        return res.status(200).send("User successfully logged in");
    }else{
        return res.status(208).json({ message: "Invalid Login. Check username and password" });
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const ISBN = req.params.isbn;
    const user = req.user.data;
    const comment = req.body.comment;

    if(user){
        books[ISBN].reviews[user] = {comment};
        return res.status(200).send(books[ISBN].reviews);
    }else{
        return res.status(404).json({ message: "Error cannot write comment" });
    }
    
});

// Delete the book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const ISBN = req.params.isbn;
    const user = req.user.data;

    if(user){
        delete books[ISBN].reviews[user];
        return res.status(200).send("Delete review from "+ user +" on the book " + books[ISBN].title);
    }else{
        return res.status(404).json({ message: "Error cannot write comment" });
    }
})

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
