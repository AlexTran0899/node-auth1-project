const User = require("../users/users-model")
const yup = require('yup')

const messageSchema = yup.object({
  username: yup.string(),
  password: yup.string().required("/ must be longer than 3/i").min(3, "/ must be longer than 3/i")
})

function restricted(req, res, next) {
  if (req.session.user) {
    next()
  } else {
    next({
      status: 401, message: 'you shall not pass'
    })
  }
}

function checkUsernameFree(req, res, next) {
  const { username } = req.body
  User.findBy({ username })
    .then(user => {
      if (!user) {
        next()
      } else {
        next({ status: 422, message: "username taken" })
      }
    })
    .catch(err => {
      next(err)
    })
}

function checkUsernameExists() {

}

async function checkPasswordLength(req, res, next) {
  try {
    const validate = await messageSchema.validate(req.body, { stripUnknown: true })
    req.body = validate
    next()
  } catch (err) {
    next({ status: 422, message: err.message })
  }
}

module.exports = {
  restricted,
  checkUsernameFree,
  checkPasswordLength,
}