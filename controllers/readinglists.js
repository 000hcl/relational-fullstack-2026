const router = require('express').Router()
const { Readinglist, User, Blog } = require('../models')
const { tokenExtractor, authorizeSession } = require('../util/middleware')

router.post('/', async (req, res) => {

  if (!req.body.blogId || !req.body.userId) {
    return res.status(400).json({ error: 'missing id'})
  }
  const user = await User.findByPk(req.body.userId)
  const blog = await Blog.findByPk(req.body.blogId)
  if (!blog) {
    return res.status(404).json({error: 'blog does not exist'})
  }
  if (!user) {
    return res.status(404).json({ error: 'user does not exist'})
  }

  const readingentryexisting = await Readinglist.findOne({ where: {
    ...req.body
  }})
  if (readingentryexisting) {
    return res.status(400).json({ error: 'blog already added to reading list'})
  }
  const readingentry = await Readinglist.create({
    userId: user.id,
    blogId: blog.id
  })
  //for the tests because they assume snakecase
  res.json({
    id: readingentry.id,
    blog_id: readingentry.blogId,
    user_id: readingentry.userId,
    read: false
  })

})

router.put('/:id', tokenExtractor, authorizeSession, async (req, res) => {
  const read = req.body.read
  const user = await User.findByPk(req.decodedToken.id)
  const entry = await Readinglist.findByPk(req.params.id)
  if (!entry) {
    return res.status(404).json({error: 'reading list entry not found'})
  }
  const blog = await Blog.findByPk(entry.blogId)
  const listuser = await User.findByPk(entry.userId)
  if (!blog || !listuser) {
    return res.status(404).json({ error: 'user or blog not found' })
  }
  if (req.authorized) {
    if (user && user.id === entry?.userId) {
      entry.read = read
      await entry.save()
      return res.json(entry)
    } else {
      return res.status(401).json({ error: 'Unauthorized' })
    }
  }


})

module.exports = router