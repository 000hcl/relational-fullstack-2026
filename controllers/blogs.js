const router = require('express').Router()
const { blogFinder, tokenExtractor } = require('../util/middleware')
const { Op } = require('sequelize')
const { Blog, User } = require('../models')



router.get('/', async (req, res) => {
  let where = {}
  if (req.query.search) {
    where = {
      [Op.or]: [
        {
          title: {[Op.iLike]: `%${req.query.search}%`}
        },
        {
          author: {[Op.iLike]: `%${req.query.search}%`}
        }
      ]
    }
  }
  const blogs = await Blog.findAll({
    order: [
      ['likes', 'DESC']
    ],
    include: {
      model: User
    },
    where
  })  
  res.json(blogs)
})

router.post('/', tokenExtractor, async (req, res) => {
  const user = await User.findByPk(req.decodedToken.id)
  const blog = await Blog.create({ ...req.body, userId: user.id })
  return res.json(blog)


})

router.delete('/:id', blogFinder, tokenExtractor, async (req, res) => {
  try {
    const user = await User.findByPk(req.decodedToken.id)
    const blog = req.blog
    if (user && user.id === blog?.userId) {
      if (blog) {
        console.log(blog.toJSON())
        await blog.destroy()
        res.status(204).end()
      } else {
        res.status(404).end()
      }
    } else {
      res.status(401).json({ error: 'Unauthorized' })
    }

  } catch (error) {
    return res.status(400).json({ error })
  }

})

router.put('/:id', blogFinder, async (req, res) => {
  const newLikes = req.body.likes
  req.blog.likes = newLikes
  await req.blog.save()
  res.json(req.blog)
})

module.exports = router