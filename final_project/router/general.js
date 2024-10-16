const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
let prompt = require('prompt-sync')();

const getAllBooks = new Promise((resolve, reject) => {

});


public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    if(username && password){
        if(isValid(username)){
            users.push({"username":username, "password": password});
            return res.status(200).json({message: "User successfully registered. Now you can login"});
        }else{
            return res.status(404).json({message: "User already exists!"});
        }
    }
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    let getAllBooks = new Promise((resolve, reject) => {
        try {
            // Reading the books
            books
            // Resolving the promise with the data if read successfully
            resolve(books);
        } catch (err) {
            // Rejecting the promise if an error occurs
            reject(err);
        }
    });
    getAllBooks.then((books) =>  res.send(JSON.stringify(books, null, 4)).status(200),
                     (err) =>    res.status(404).json({message: "Books is not found"}));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const ISBN = req.params.isbn;
  if(ISBN){
    let getBookOnISBN = new Promise((resolve, reject) => {
        try {
            // Finding book
            let b = books[ISBN]
            // Resolving the promise with the data if read successfully
            resolve(b);
        } catch (err) {
            // Rejecting the promise if an error occurs
            reject(err);
        }
    })
    getBookOnISBN.then((book) =>  res.send(JSON.stringify(book, null, 4)).status(200),
                     (err) =>    res.status(303).json({message: "Books is not found"}));
  }
  
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  if(author){
    let getBookOnISBN = new Promise((resolve, reject) => {
        try {
            // Finding book
            let filtered_books = Object.values(books)
                                    .filter((book) => book.author === author)
                                    .map((book) => {
                                                return {
                                                    title: book.title,
                                                    reviews: book.reviews,
                                                };
            });
            // Resolving the promise with the data if read successfully
            resolve(filtered_books);
        } catch (err) {
            // Rejecting the promise if an error occurs
            reject(err);
        }
        
    })
    getBookOnISBN.then((filtered) =>  res.send("Author "+author+" " + JSON.stringify(filtered, null, 4)),
                     (err) =>    res.status(303).json({message: "Books is not found"}));
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;
    if(title){
        let getBooksByTitle = new Promise((resolve, reject) => {
            try{
                // Finding book
                let filtered_books = Object.values(books)
                                            .filter((book) => book.title === title)
                                            .map((book) => {
                                                return {
                                                    author: book.author,
                                                    reviews: book.reviews,
                                                };
                                            });
                // Resolving the promise with the data if read successfully
                resolve(filtered_books);
            }catch{
                // Rejecting the promise if an error occurs
                reject(err);
            }
        })

        getBooksByTitle.then((filtered) =>  res.send("Title "+title+" " + JSON.stringify(filtered, null, 4)),
        (err) =>    res.status(303).json({message: "Books is not found"}));
    }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  if(isbn){
    let book_rev = books[isbn];
    return res.status(200).send(JSON.stringify(book_rev, null, 4));
  }
  return res.status(200).json({message: "Book not found"});
});

module.exports.general = public_users;
