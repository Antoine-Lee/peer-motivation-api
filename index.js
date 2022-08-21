require ("dotenv").config (); 

const express = require ("express"); 
const mongoose = require ("mongoose"); 
const session = require ("express-session"); 
const cors = require ("cors"); 

const routes = require ("./routes"); 

const { mongo_uri, port=3001 } = process.env; 

const app = express (); 

app.use (cors ()); 
app.use (express.json ()); 
app.use (express.urlencoded ({
    extended: true
})); 
app.use (session ({
    secret: "xSessionSecret44", 
    resave: false, 
    saveUninitialized: false
    // resave: true, 
    // saveUninitialized: true, 
    // cookie: {
    //     secure: false
    // }
}))
app.use (routes); 

mongoose.connect (mongo_uri); 

app.listen (port, () => 
{
    console.log ("LISTENING ON PORT " + port); 
}); 