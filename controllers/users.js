const router = require('express').Router()
const bcrypt = require('bcrypt')

const { User, Blog, Readinglist } = require('../models')

router.get('/', async (req, res) => {
  const users = await User.findAll({
    include: {
      model: Blog
    },
    attributes: {
      exclude: ['password']
    }
  })
  res.json(users)
})

router.get('/:id', async (req, res) => {
  const users = await User.findOne({
    where: {
      id: req.params.id
    },
    attributes: {
      exclude: ['password']
    },
    include: {
      model: Blog,
      as: 'readings',
      through: {
        attributes: ['read', 'id'],
        as: 'reading_list'
      },
    }
  })
  res.json(users)
})

router.post('/', async (req, res) => {
  const saltRounds = 10
  const passwordHash = await bcrypt.hash(req.body.password, saltRounds)

  const user = await User.create({
    username: req.body.username,
    name: req.body.name,
    password: passwordHash
  })
  res.json(user)
})

router.put('/:username', async (req, res) => {
  const user = await User.findOne({
    where: {
      username: req.params.username
    }
  })
  user.name = req.body.newName
  await user.save()
})

module.exports = router