const router = require('express').Router()
const { Readinglist, User } = require('../models')
const { tokenExtractor } = require('../util/middleware')

router.post('/', async (req, res) => {
  const readingentry = await Readinglist.create({
    ...req.body
  })
  res.json(readingentry)
})

router.put('/:id', tokenExtractor, async (req, res) => {
  const read = req.body.read
  const user = await User.findByPk(req.decodedToken.id)
  const entry = await Readinglist.findByPk(req.params.id)
  if (user && user.id === entry?.userId) {
    entry.read = read
    await entry.save()
    return res.json(entry)
  } else {
    return res.status(401).json({ error: 'Unauthorized' })
  }

})

module.exports = router