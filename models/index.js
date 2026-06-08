
const Blog = require('./blog')
const User = require('./user')
const Readinglist = require('./readinglist')

User.hasMany(Blog)
Blog.belongsTo(User)
Blog.belongsToMany(User, {through: Readinglist})
User.belongsToMany(Blog, {through: Readinglist, as: 'readings'})
User.hasMany(Readinglist)
Readinglist.belongsTo(User)
Readinglist.belongsTo(Blog)

module.exports = {
  Blog,
  User,
  Readinglist
}