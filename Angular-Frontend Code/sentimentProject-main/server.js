const express = require('express');
const http = require('http');
const path = require('path');
const cors= require('cors');
const app = express();

const port = process.env.PORT || 3001;

app.use(cors())
app.post("/addfile", function(req,res,next){

})

const server = http.createServer(app);

server.listen(port, () => console.log(`App running on: http://localhost:${port}`))