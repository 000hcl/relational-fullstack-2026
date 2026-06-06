const express = require('express')
const { errorHandler } = require('./util/middleware')
const { Blog, User } = require('./models')
const app = express()

const { PORT } = require('./util/config')
const { connectToDatabase } = require('./util/db')

const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const authorRouter = require('./controllers/authors')

app.use(express.json())

app.get('/api', async (req, res) => {
  res.status(200).end()
})

app.post('/api/reset', async (req, res) => {
  await User.destroy({truncate: true, cascade: true})
  await Blog.destroy({truncate: true, cascade: true})
  res.status(204).end()
})

app.use('/api/blogs', blogsRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)
app.use('/api/authors', authorRouter)
app.use(errorHandler)


const start = async () => {
  await connectToDatabase()
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
}

start()