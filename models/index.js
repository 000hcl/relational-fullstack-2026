const Blog = require('./blog')
const User = require('./user')


User.sync({ alter: true })
Blog.sync({ alter: true })


User.hasMany(Blog)
Blog.belongsTo(User)

module.exports = {
  Blog,
  User
}