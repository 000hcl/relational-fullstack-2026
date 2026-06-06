const router = require('express').Router()
const { blogFinder, tokenExtractor } = require('../util/middleware')

const { Blog, User } = require('../models')



router.get('/', async (req, res) => {
  const blogs = await Blog.findAll()  
  res.json(blogs)
})

router.post('/', tokenExtractor, async (req, res) => {
  try {
    const user = await User.findByPk(req.decodedToken.id)
    const blog = await Blog.create({ ...req.body, userId: user.id })
    return res.json(blog)
  } catch(error) {
    return res.status(400).json({ error })
  }

})

router.delete('/:id', blogFinder, tokenExtractor, async (req, res) => {
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