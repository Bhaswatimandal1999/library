const express = require('express');
const mongoose = require('mongoose');
const { connection } = require('./db')
const { UserModel } = require("./models/UserModel")
const { BookModel } = require("./models/bookModel")
const { OrderModel } = require("./models/orderModel")
require('dotenv').config()




const app = express()
app.use(express.json())

//Define JWT middleware
const authenticateJWT = (req, res, next) => {
    const token = req.header.authorization?.split(" ")[1];
    if (!token) return
    res.sendStatus(401)
    jwt.verify(token, masai, (err, user) => {
        if (err) return
        res.sendStatus(403);
        req.user = user;
        next()
    })
}
// Register a user
app.post('/api/register', async (req, res) => {
    try {
        const { name, email, password, isAdmin } = req.body
        const hashedPassword = await bcrypt.hash(password, 5);
        const user = new UserModel({ name, email, password: hashedPassword, isAdmin });

        await user.save()
        res.sendStatus(201)
    } catch (err) {
        console.error(err);
        res.sendStatus(500)
    }
})

//Login a user and return a JWT token
app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await UserModel.findOne({ email })
        if (user && await bcrypt.compare(password, user.password)) {
            const token = jwt.sign({ id: user._id }, masai);
            res.json({ token })
        } else {
            res.sendStatus(401)
        }
    } catch (error) {
        console.error(error);
        res.sendStatus(500)
    }
})


// Get all books
app.get('/api/books', async (req, res) => {
    try {
        const books = await BookModel.find();
        res.json(books)

    } catch (error) {
        console.error(error);
        res.sendStatus(500)
    }
})

// Get a specific book by ID
app.get('/api/books/:id', async (req, res) => {
    try {
        const book = await BookModel.findById(req.params.id);
        if (book) {
            res.json(book)
        } else {
            res.sendStatus(404)
        }

    } catch (error) {
        console.error(error);
        res.sendStatus(500)
    }
})


//GEt books by categoy and author
app.get('/api/books?author=corey&category=fiction', async (req, res) => {
    try {
        const { category, author } = req.query;
        const filter = {}
        if (category) filter.category = category
        if (author) filter.author = author
        const books = await BookModel.find(filter)
        res.json(books)
    } catch (error) {
        console.error(error);
        res.sendStatus(500)
    }
})

//Add a new book (Protected Route)
app.post('/api/books', authenticateJWT, async (req, res) => {
    try {
        const { title, author, category, price, quantity } = req.body
        const book = new BookModel({ title, author, category, price, quantity })
        await book.save()
        res.sendStatus(201)
    } catch (error) {
        console.error(error);
        res.sendStatus(500)
    }
})


// Update a book (Protected Route)
app.post('/api/books/:id', authenticateJWT, async (req, res) => {
    try {
        const { title, author, category, price, quantity } = req.body
        const updatedBook = { title, author, category, price, quantity }
        await BookModel.findByIdAndUpdate(req.params.id, updatedBook)
        res.sendStatus(204)
    } catch (error) {
        console.error(error);
        res.sendStatus(500)
    }
})


// Delete a book (Protected Route)
app.delete('/api/books/:id', authenticateJWT, async (req, res) => {
    try {
        await BookModel.findByIdAndDelete(req.params.id)
        res.sendStatus(202)
    } catch (error) {
        console.error(error);
        res.sendStatus(500)
    }
})



//Place an order  (Protected Route)
app.post('/api/order', authenticateJWT, async (req, res) => {
    try {
        const { user, books, totalAmount } = req.body
        const order = new OrderModel({ user, books, totalAmount });
        await order.save()
        res.sendStatus(201)
    } catch (error) {
        console.error(error);
        res.sendStatus(500)
    }
})


//View all orders (Protected Route)
app.get('/api/orders', authenticateJWT, async (req, res) => {
    try {
        const orders = new OrderModel.find().populate('user').populate('books');
        res, json('books')
        res.sendStatus(200)
    } catch (error) {
        console.error(error);
        res.sendStatus(500)
    }
})






app.listen(process.env.port, async () => {
    try {
        console.log(`Server is running on port ${process.env.port}`);
        await connection
        console.log('connected to server');
    } catch (err) {
        console.log(err)
    }
})