require('dotenv').config();
require('express-async-errors');

const express = require('express');
const app = express();

// connection
const connectToDb = require('./db/connection');

// Routes
const {authRoutes} = require('./routes')

// middleware
const {errorHandler, notFound} = require('./middleware');

app.get('/', (req, res) => {
    res.send('Hello world')
})

app.use(express.json());

app.use('/api/v1/auth', authRoutes);

app.use(notFound);
app.use(errorHandler);

const port = process.env.PORT || 5000;

const start = async () => {
    try {
        await connectToDb(process.env.MONGO_URI);
        app.listen(port, () => {
            console.log(`Server is listening on port: ${port}`);
        })
    } catch (error) {
        throw new Error('Server error')
    }
}

// start the server
start();