// Require `checkUsernameFree`, `checkUsernameExists` and `checkPasswordLength`
// middleware functions from `auth-middleware.js`. You will need them here!


/**
  1 [POST] /api/auth/register { "username": "sue", "password": "1234" }

  response:
  status 200
  {
    "user_id": 2,
    "username": "sue"
  }

  response on username taken:
  status 422
  {
    "message": "Username taken"
  }

  response on password three chars or less:
  status 422
  {
    "message": "Password must be longer than 3 chars"
  }
 */


/**
  2 [POST] /api/auth/login { "username": "sue", "password": "1234" }

  response:
  status 200
  {
    "message": "Welcome sue!"
  }

  response on invalid credentials:
  status 401
  {
    "message": "Invalid credentials"
  }
 */


/**
  3 [GET] /api/auth/logout

  response for logged-in users:
  status 200
  {
    "message": "logged out"
  }

  response for not-logged-in users:
  status 200
  {
    "message": "no session"
  }
 */

 
// Don't forget to add the router to the `exports` object so it can be required in other modules
const router = require('express').Router()
const User = require('../users/users-model')
const bcrypt = require('bcryptjs')

router.post('/register', (req, res, next) => {
  const {username, password} = req.body
  const hash = bcrypt.hashSync(password, 8)

  User.add({username, password: hash})
  .then(user => {
    res.status(201).json({message: `welcome ${user.username}`})
  })
  .catch(err => {
    next(err)
  })
})

router.post('/login', (req,res,next) => {
  const {username, password} = req.body
  User.findBy({username}) 
  .then(([user]) => {
    if(user && bcrypt.compareSync(password, user.password)) {
      req.session.user = user
      res.json({message: `welcome ${user.username}`})
    } else {
       next({
         status: 401, 
         message: `invalid credentials`
       })
    }
  })
  .catch(err => {
    next(err)
  })
})

router.get('/logout', (req,res,next) => {
  if(req.session.user) {
    req.session.destroy(err => {
      if(err) {
        res.json({message: 'you cannnot leave!'})
      } else {
        res.json({message: 'you were never login'})
      }
    })
  }
})
module.exports = router;