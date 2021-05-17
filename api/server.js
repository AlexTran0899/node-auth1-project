const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const path = require('path');
const KnexSessionStore = require('connect-session-knex')(session);
const usersRouter = require('./users/users-router');
const authRouter = require('./auth/auth-router');
const server = express();

const sessionConfig = {
  name: 'chocolatechip',
  secret: 'keep it secret, keep it safe!',
  cookie: {
    maxAge: 1000 * 60 * 60,
    secure: false, // if true the cookie is not set unless it's an https connection
    httpOnly: false, // if true the cookie is not accessible through document.cookie
  },
  rolling: true,
  resave: false, // some data stores need this set to true
  saveUninitialized: false, // privacy implications, if false no cookie is set on client unless the req.session is changed
  store: new KnexSessionStore({
    knex: require('../data/db-config'), // configured instance of knex
    tablename: 'sessions', // table that will store sessions inside the db, name it anything you want
    sidfieldname: 'sid', // column that will hold the session id, name it anything you want
    createtable: true, // if the table does not exist, it will create it automatically
    clearInterval: 1000 * 60 * 60, // time it takes to check for old sessions and remove them from the database to keep it clean and performant
  }),
};


const server = express();

server.use(session(sessionConfig));
server.use(helmet());
server.use(express.json());
server.use(cors());

server.use('/api/auth', authRouter);
server.use('/api/users', usersRouter);

server.get("/", (req, res) => {
  res.json({ api: "up" });
});

server.use((err, req, res, next) => { // eslint-disable-line
  res.status(err.status || 500).json({
    message: err.message,
    stack: err.stack,
  });
});

module.exports = server;
