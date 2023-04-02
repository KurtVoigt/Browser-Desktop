const express = require('express');
const path = require('path');
const textRouter = require("./routes/text-file.cjs");

const app = express();
// serve up production assets
app.use(express.static('./dist'));
// let the react app to handle any unknown routes 
// serve up the index.html if express does'nt recognize the route
app.use('/text-file', textRouter);

app.get('*', (req, res) => {
res.sendFile(path.resolve(__dirname, '..', 'dist', 'index.html'));
});
// if not in production use the port 5000
const PORT = process.env.PORT || 5000;
console.log('server started on port:',PORT);
app.listen(PORT);