const UserDto = require("../DTO/users/UsersDTO")
const { isValidPass } = require("../utils/bcrypthash")

class SessionRepository {

  constructor(userDao, cartDao) {
    this.userDao = userDao
    this.cartDao = cartDao
  }

  login = async (email, password) => {
    try {
      const user = await this.userDao.findUser(email)
      if (!user) {
        throw new Error("Invalid credentials")
      }
      const access = await isValidPass(password, user.password)

      if (!access) {
        throw new Error("Invalid credentials")
      }

      const last_connection = {
        last_connection: new Date().toLocaleString('es-MX')
      }
      await this.userDao.updateUser(user._id, last_connection)

      const { password: dtoPassword, first_name, last_name, age, ...neededUserInfo } = UserDto.getUserDto(user)
      return neededUserInfo
    } catch (error) {
      throw new Error(error.message)
    }
  }

  logout = async (UID) => {
    try {
      const last_connection = {
        last_connection: new Date().toLocaleString('es-MX')
      }
      await this.userDao.updateUser(UID, last_connection)
    } catch (error) {
      throw new Error(error.message)
    }
  }

  currentSession = async (UID) => {
    try {
      const user = await this.userDao.findUser(UID)
      const { password, ...userDto } = UserDto.getUserDto(user)//first_name, last_name, userID, cartID, role, age
      return userDto
    } catch (error) {
      throw new Error(error.message)
    }
  }

  githubLogin = async (email, name) => {
    try {
      const user = await this.userDao.findUser(email)

      if (user) {
        const last_connection = {
          last_connection: new Date().toLocaleString('es-MX')
        }
        await this.userDao.updateUser(user._id, last_connection)
        const { password, first_name, last_name, age, ...neededUserInfo } = UserDto.getUserDto(user)
        return neededUserInfo
      }

      const newFirst_name = name.split(' ')[0]
      const newLast_name = name.split(' ')[1]

      const { _id } = await this.cartDao.newCart({})
      const newUser = {
        first_name: newFirst_name,
        last_name: newLast_name,
        cartID: _id,
        email
      }
      const userCreated = await this.userDao.addUser(newUser)

      const { password, first_name, last_name, age, ...neededUserInfo } = UserDto.getUserDto(userCreated)
      return neededUserInfo
    } catch (error) {
      throw new Error(error.message)
    }
  }
}

module.exports = SessionRepository