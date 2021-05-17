/**
  resolves to an ARRAY with all users, each user having { user_id, username }
 */

const db = require("../../data/db-config")
function find() {
  return db("users")
}

/**
  resolves to an ARRAY with all users that match the filter condition
 */
function findBy(filter) {
  // console.log(filter)
  return db('users').where(filter).first()
}

/**
  resolves to the user { user_id, username } with the given user_id
 */
function findById(user_id) {
  return db('users as u').where({user_id}).select("u.user_id", "u.username").first()
}

/**
  resolves to the newly inserted user { user_id, username }
 */
function add(user) {
  return db('users').insert(user).then(id => {
    return findById(...id)
  })
}

// Don't forget to add these to the `exports` object so they can be required in other modules
module.exports = {find, findBy, add}