const router = require('express').Router()
const { Readinglist } = require('../models')

router.post('/', async (req, res) => {
  const readingentry = await Readinglist.create({
    ...req.body
  })
  res.json(readingentry)
})

module.exports = router