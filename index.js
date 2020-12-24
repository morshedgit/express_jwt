const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

//Import Routes
const authRoute = require('./routes/auth');
const postRoute = require('./routes/post');

const app = express();

dotenv.config()

//Connect to DB
mongoose.connect(process.env.DB_CONNECT,
{ useUnifiedTopology: true, useNewUrlParser: true },
()=>{
    console.log('Connected to db')
})

//Middlewares
app.use(express.json());
app.use(cors());


//Route Middlewares
app.use('/api/user',authRoute);
app.use('/api/post',postRoute);

app.listen(3000,()=>console.log('Server listening on port: '+3000))
