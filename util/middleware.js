const { Blog } = require('../models')
const jwt = require('jsonwebtoken')
const { SECRET } = require('../util/config')

const errorHandler = (error, request, response, next) => {
    if (error.name === 'SequelizeValidationError') {
      const errors = error.errors.map(e => e.message)
      if (String(errors) === 'Validation isEmail on username failed') {
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