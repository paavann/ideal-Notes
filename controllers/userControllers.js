const asyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt')
const User = require('../database/User.model')
const Note = require('../database/Note.model')



//get all users
const getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find().select('-password').lean()
    if (!users?.length) {
        return res.status(404).json({ success: false, message: "users don't exists" })
    }
    res.json(users)
})

//create user
const createUser = asyncHandler(async (req, res) => {
    const { username, password, roles } = req.body
    //check for all fields
    if (!username || !password || !Array.isArray(roles) || !roles.length) {
        return res.status(400).json({ success: false, message: "all fields are required" })
    }
    //check for duplicate data/user
    const duplicate = await User.findOne({ username }).lean().exec() //exec() ----> when dealing with promises
    if (duplicate) {
        return res.status(409).json({ success: false, message: "user already exists" })
    }
    //hash password
    const hashedPassword = await bcrypt.hash(password, 10)
    const userObject = { username, "password": hashedPassword, roles }
    //create user in the database
    const createUser = await User.create(userObject)
    if (createUser) {
        res.status(200).json({ success: true, message: ` user ${username} was successfully created` })
    } else {
        res.status(400).json({ success: false, message: "user could not be created" })
    }
})

//update user
const updateUser = asyncHandler(async (req, res) => {
    const { id, username, password, roles, active } = req.body
    //check for all fields
    if (!id || !username || !Array.isArray(roles) || !roles.length || typeof active !== "boolean") {
        return res.status(400).json({ success: false, message: "all fields are requried" })
    }
    //finding the user to update
    const user = await User.findById(id).exec()
    if (!user) {
        return res.status(400).json({ success: false, message: "user was not found" })
    }
    //check for any duplicate user
    const duplicate = await User.findOne({ username }).lean().exec()
    if (duplicate && duplicate?._id.toString() !== id) {
        return res.status(409).json({ success: false, message: "username already exists" })
    }
    //update user
    user.username = username
    user.roles = roles
    if (password) { //password may or may not need to be updated
        const hashedPassword = await bcrypt.hash(password, 10)
        user.password = hashedPassword
    }
    user.active = active
    const updatedUser = await user.save()
    res.status(200).json({ success: true, message: `user ${updatedUser.username} was successfully updated` })
})

//delete user
const deleteUser = asyncHandler(async (req, res) => {
    const { id, username } = req.body
    //check for id
    if (!id) {
        return res.status(400).json({ success: false, message: "id is required" })
    }
    //check if user has assigned notes
    const assignedNote = await Note.findOne({ user: id }).lean().exec()
    if (assignedNote?.length) {
        return res.status(400).json({ success: false, message: "user has assigned notes" })
    }
    //check of user in database
    const user = await User.findById(id).exec()
    if (!user) {
        return res.status(404).json({ success: false, message: `user with the id ${id} not found` })
    }
    //delete user
    const result = await User.deleteOne(user)
    res.status(200).json({ success: true, message: `user ${user.username} with id ${user.id} was deleted successfully` })
})



module.exports = { getAllUsers, createUser, updateUser, deleteUser }