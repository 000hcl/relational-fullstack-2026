const { Blog } = require('../models')
const jwt = require('jsonwebtoken')
const { SECRET } = require('../util/config')

const errorHandler = (error, request, response, next) => {
  
  if (error.name === 'SequelizeForeignKeyConstraintError') {
    if (String(error).includes('readinglists_user_id_fkey')) {
      return response.status(400).send({ error: 'User does not exist.'})
    }
    if (String(error).includes('readinglists_blog_id_fkey')) {
      return response.status(400).send({ error: 'Blog does not exist.'})
    }
  }
  else if (error.name === 'SequelizeValidationError') {
    const errors = String(error.errors.map(e => e.message))
    if (String(errors).includes('min on year')) {
      return response.status(400).send({ error: 'Year must be at least 1991' })
    }
    else if (String(errors).includes('max on year')) {
      return response.status(400).send({ error: 'Year must be at most 2026' })
    }
    else if (String(errors) === 'Validation isEmail on username failed') {
      return response.status(400).send({ error: 'username must be a valid email address' })
    }
      return response.status(400).send({ error: `invalid values submitted: ${errors}` })
  } else if (error.name === 'SequelizeUniqueConstraintError') {
    return response.status(400).send({ error: 'Username must be unique.'})
  }
  
  else if (error) {
      console.log(error.name)
      return response.status(400).send({ error: `${error}` })
  }

  next(error)
}

const tokenExtractor = (req, res, next) => {
  const authorization = req.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    try {
      req.decodedToken = jwt.verify(authorization.substring(7), SECRET)
    } catch{
      return res.status(401).json({ error: 'token invalid' })
    }
  }  else {
    return res.status(401).json({ error: 'token missing' })
  }
  next()
}

const blogFinder = async (req, res, next) => {
  req.blog = await Blog.findByPk(req.params.id)
  if (!req.blog) {
    return res.status(404).end()
  }
  next()
}

module.exports = { errorHandler, blogFinder, tokenExtractor }