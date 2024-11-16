const express = require('express')
const usersController = require('../controllers/userControllers')



const router = express.Router()

router.route('/')
    .get(usersController.getAllUsers)
    .post(usersController.createUser)
    .patch(usersController.updateUser)
    .delete(usersController.deleteUser)



module.exports = router