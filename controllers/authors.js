const router = require('express').Router()
const { Op, fn, col } = require('sequelize')
const { Blog } = require('../models')

router.get('/', async (req, res) => {
  const blogs = await Blog.findAll({
    order: [
      ['likes', 'DESC']
    ],
    group: 'author',
    attributes: [
      'author',
      [fn('COUNT', col('id')), 'blogs'],
      [fn('SUM', col('likes')), 'likes']
    ]
  })
  res.json(blogs)
})

module.exports = router