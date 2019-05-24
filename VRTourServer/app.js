const express = require('express');
const fs = require('fs');
const router = require('express').Router();
const app = express();
const bodyParser= require('body-parser')
const server = require('http').Server(app);
const config = require('./config');
const apiRouter = require('./router');
const {basicCORSHeaders} = require("./util");

server.listen(config.port);
app.enable("trust proxy");
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json())
app.use(basicCORSHeaders);
app.use("/api", apiRouter);
app.use("/", express.static(config.publicLocation));
app.use("/admin", express.static(config.adminLocation));
app.use("/gets", express.static(config.storageLocation));
console.log("server started, listening on port:", config.port);
