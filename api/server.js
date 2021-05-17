const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const session = require('express-session');
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
    secure: false, 
    httpOnly: false, 
  },
  rolling: true,
  resave: false, 
  saveUninitialized: false,
  store: new KnexSessionStore({
    knex: require('../data/db-config'), 
    tablename: 'sessions', 
    sidfieldname: 'sid',
    createtable: true, 
    clearInterval: 1000 * 60 * 60,
  }),
};

server.use(session(sessionConfig));
server.use(helmet());
server.use(express.json());
server.use(cors());

server.use('/api/auth', authRouter);
server.use('/api/users', usersRouter);

server.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    message: err.message,
    stack: err.stack,
  });
});

module.exports = server;
