const { Blog } = require('../models')

const errorHandler = (error, request, response, next) => {
    if (error.name === 'SequelizeValidationError') {
        return response.status(400).send({ error: `invalid values submitted: ${error.errors.map(e => e.message)}` })
    } else if (error) {
        console.log(error.name)
        return response.status(400).send({ error: `${error}` })
    }
  
    next(error)
}

const blogFinder = async (req, res, next) => {
  req.blog = await Blog.findByPk(req.params.id)
  if (!req.blog) {
    return res.status(404).end()
  }
  next()
}

module.exports = { errorHandler, blogFinder }