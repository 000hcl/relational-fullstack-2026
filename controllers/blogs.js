const router = require('express').Router()
const { errorHandler, blogFinder } = require('../util/middleware')

const { Blog } = require('../models')



router.get('/', async (req, res) => {
  const blogs = await Blog.findAll()  
  res.json(blogs)
})

router.post('/', async (req, res) => {
  const blog = await Blog.create({...req.body})
  return res.json(blog)
})

router.delete('/:id', blogFinder, async (req, res) => {
  const blog = req.blog
  if (blog) {
    console.log(blog.toJSON())
    await blog.destroy()
    res.status(204).end()
  } else {
    res.status(404).end()
  }
})

router.put('/:id', blogFinder, async (req, res) => {
  const newLikes = req.body.likes
  req.blog.likes = newLikes
  await req.blog.save()
  res.json(req.blog)
})

module.exports = router