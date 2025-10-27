// app.js
const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const cors = require('cors');

const app = express();

// connect to Mongo **after** dotenv.config()

const connectToDb = require('./db/database');
const userRoutes=require('./routes/user.routes');
connectToDb();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.get('/', (req, res) => {
  res.send('Hello World');
});


app.use('/users',userRoutes);
module.exports = app;
