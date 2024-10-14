const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    res.send(JSON.stringify(books, null, 4)).status(200);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const ISBN = req.params.isbn;
  if(ISBN){
    res.send(JSON.stringify(books[ISBN], null, 4)).status(200);
  }
  res.send("Unable to find book!").status(200);
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  if(author){
    let filtered_books = Object.values(books).filter((book) => book.author === author)
        .map((book) => {
            return {
                title: book.title,
                reviews: book.reviews,
            };
        });
    return res.status(200).send("Author "+author+" " + JSON.stringify(filtered_books, null, 4));
  }
  res.send("Author is not define").status(200);
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;
    if(title){
      let filtered_books = Object.values(books).filter((book) => book.title === title)
          .map((book) => {
              return {
                  author: book.author,
                  reviews: book.reviews,
              };
          });
      return res.status(200).send("Title "+title+" " + JSON.stringify(filtered_books, null, 4));
    }
    res.send("Author is not define").status(200);
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
