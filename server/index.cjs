const express = require('express');
const path = require('path');
const textRouter = require("./routes/text-file.cjs");
const signUpRouter = require("./routes/user-signup.cjs");
const signInRouter = require("./routes/user-signin.cjs")
const http = require("http");
const fs = require("fs");
require('dotenv').config({path: path.resolve(__dirname, '.','.env')});

const app = express();
// serve up production assets
app.use(express.static('./dist'));
// let the react app to handle any unknown routes 
// serve up the index.html if express does'nt recognize the route
app.use('/text-file', textRouter);
app.use('/signup', signUpRouter);
app.use('/signin',signInRouter);

app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '..', 'dist', 'index.html'));
});
// if not in production use the port 5000
const PORT = process.env.PORT || 5000;
console.log('server started on port:', PORT);
http.createServer(app).listen(PORT);
/*key: fs.readFileSync(path.resolve(__dirname, '..', 'localhost-key.pem')),
    cert: fs.readFileSync(path.resolve(__dirname, '..', 'localhost.pem'))*/