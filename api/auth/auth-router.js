const router = require('express').Router()
const User = require('../users/users-model')
const bcrypt = require('bcryptjs')
const { checkUsernameFree, checkPasswordLength } = require('./auth-middleware')

router.post('/register', checkUsernameFree, checkPasswordLength, (req, res, next) => {
  const { username, password } = req.body
  const hash = bcrypt.hashSync(password, 8)

  User.add({ username, password: hash })
    .then(user => {
      res.status(201).json(user)
    })
    .catch(err => {
      next(err)
    })
})

router.post('/login', (req, res, next) => {
  const { username, password } = req.body
  User.findBy({ username })
    .then(user => {
      if (user && bcrypt.compareSync(password, user.password)) {
        req.session.user = user
        res.json({ message: `welcome ${user.username}` })
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

router.get('/logout', (req, res, next) => {
  if (req.session.user) {
    req.session.destroy(err => {
      if (err) {
        res.json({ message: 'you cannnot leave!' })
      } else {
        res.json({ message: 'logged out' })
      }
    })
  } else {
    res.json({ message: "no session" })
  }
})
module.exports = router;