const db = require("../../data/db-config")
function find() {
  return db("users")
}

function findBy(filter) {
  return db('users').where(filter).first()
}

function findById(user_id) {
  return db('users as u').where({user_id}).select("u.user_id", "u.username").first()
}

function add(user) {
  return db('users').insert(user).then(id => {
    return findById(...id)
  })
}

module.exports = {find, findBy, add}