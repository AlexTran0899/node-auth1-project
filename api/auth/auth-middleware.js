const User = require("../users/users-model")
const yup = require('yup')

const messageSchema = yup.object({
  username: yup.string(),
  password: yup.string().required("/ must be longer than 3/i").min(3, "/ must be longer than 3/i")
})

function restricted(req, res,next) {
  if(req.session.user) {
    next()
  } else {
    next({
      status: 401, message: 'you shall not pass'
    })
  }
}

function checkUsernameFree(req, res,next){
  const {username} = req.body
  User.findBy({username})
  .then(user => {
    if(!user) {
      next()
    } else {
      next({status: 422, message: "username taken"})
    }
  })
  .catch(err => {
    next(err)
  })
}

/*
  If the username in req.body does NOT exist in the database

  status 401
  {
    "message": "Invalid credentials"
  }
*/
function checkUsernameExists() {

}

/*
  If password is missing from req.body, or if it's 3 chars or shorter

  status 422
  {
    "message": "Password must be longer than 3 chars"
  }
*/
async function checkPasswordLength(req, res,next) {
  try {
    const validate = await messageSchema.validate(req.body, { stripUnknown: true })
    req.body = validate
    next()
} catch (err) {
    next({ status: 422, message: err.message })
}
}

// Don't forget to add these to the `exports` object so they can be required in other modules

module.exports = {
  restricted,
  checkUsernameFree,
  checkPasswordLength,
}