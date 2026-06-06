require('dotenv').config()

const DATABASE_URL = process.env.TESTING
   ? process.env.TEST_DATABASE_URL
  : process.env.DATABASE_URL

//for github actions:
DATABASE_URL = DATABASE_URL ? DATABASE_URL : process.env.TEST_DATABASE_URL

module.exports = {
  DATABASE_URL,
  PORT: process.env.PORT || 3001,
  SECRET: process.env.SECRET,
}