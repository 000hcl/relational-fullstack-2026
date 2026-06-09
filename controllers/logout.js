const router = require('express').Router()
const { Session, User } = require('../models')
const { tokenExtractor } = require('../util/middleware')

router.delete('/', tokenExtractor, async (request, response) => {
  try {
    const user = await User.findByPk(request.decodedToken.id)
    await Session.destroy({
      where: {
        userId: user.id
      }
    })
    return response.status(204).end()
  } catch {
    return response.status(400).send({error: 'Could not log out'})
  }
})

module.exports = router