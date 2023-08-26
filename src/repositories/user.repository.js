const UserDto = require('../DTO/users/UsersDTO')
const { createHash, isValidPass } = require('../utils/bcrypthash')

class UserRepository {
    constructor(userDao, cartDao) {
        this.userDao = userDao
        this.cartDao = cartDao
    }

    getUsers = async (query) => {
        try {
            const { docs, ...pagination } = await this.userDao.getUsers(query)
            if (docs.length === 0) {
                return docs
            }
            const normalizedUsers = docs.map(user => {
                const { email, first_name, last_name, age, role, last_connection } = UserDto.getUserDto(user)

                return {
                    email,
                    first_name,
                    last_name,
                    age,
                    role,
                    last_connection
                }
            })
            return { normalizedUsers, pagination }
        } catch (error) {
            throw error
        }
    }

    addUser = async (userData) => {
        try {
            const { email } = userData
            const alreadyRegistered = await this.userDao.findUser(email)

            if (alreadyRegistered) {
                throw new Error('Error creating a new user')
            }
            const hashPassword = await createHash(userData.password)
            const { _id } = await this.cartDao.newCart({})
            userData.password = hashPassword
            userData.cartID = _id
            const newUser = await this.userDao.addUser(userData)

            const { password, ...neededValues } = UserDto.getUserDto(newUser)

            return neededValues
        } catch (error) {
            throw error
        }
    }

    /**
     * Method to search a user using the ID or Email user
     * @param {String} userInfo Parameter recives user ID or Email
     * @returns {Promise<Object<<any>> | error } Returns a promise object if the query its ok, return a error if something gone wrong
     */
    findUser = async (userInfo) => {
        try {
            const user = await this.userDao.findUser(userInfo)
            if (user) {
                const { password, ...normalizedUser } = UserDto.getUserDto(user)
                return normalizedUser
            }
            throw new Error('User not found')
        } catch (error) {
            throw error
        }
    }

    updateUser = async (UID, body) => {
        try {
            const updatedUser = await this.userDao.updateUser(UID, body)
            if (updatedUser) {
                const { password, ...user } = UserDto.getUserDto(updatedUser)
                return user
            }
            throw new Error('User not found')
        } catch (error) {
            throw error
        }
    }

    updateDocuments = async (uid, documents) => {
        try {
            return await this.userDao.updateDocuments(uid, documents)
        } catch (error) {
            throw new Error(error)
        }
    }

    deleteUser = async (uid) => {
        try {
            const deleted = await this.userDao.deleteUser(uid)
            if (deleted) {
                await this.cartDao.deleteCart(deleted.cartID)
                const { password, ...user } = UserDto.getUserDto(deleted)
                return user
            }
            throw new Error('user not found')
        } catch (error) {
            throw error
        }
    }

    changePassword = async (email, newPassword) => {
        try {
            const user = await this.userDao.findUser(email)
            if (!user) {
                throw new Error('Something gone wrong')
            }

            const samePass = await isValidPass(newPassword, user.password)
            if (samePass) {
                throw new Error("Can't change a password for the same password")
            }

            const hashPassword = await createHash(newPassword)
            const update = await this.userDao.updateUser(user._id, { password: hashPassword })

            const { password, ...userWNewPass } = UserDto.getUserDto(update)
            return userWNewPass
        } catch (error) {
            throw error
        }
    }
}

module.exports = UserRepository