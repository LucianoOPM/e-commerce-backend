const fsPromises = require('node:fs/promises')
const path = './src/DAO/FSDAO/userData.json'
const { access, readFile, writeFile, appendFile, constants } = fsPromises


class UserDao {
    constructor() {
        this.user = []
        this.#createFile()
    }

    #createFile = async () => {
        try {
            await access(path, constants.F_OK)
            const read = await readFile(path, "utf-8")
            if (!read) {
                await writeFile(path, JSON.stringify(this.user), "utf-8")
            }
            this.user = JSON.parse(read)
        } catch (error) {
            writeFile(path, JSON.stringify(this.user), "utf-8")
        }
    }

    addUser = async (user) => {
        try {
            this.user.push(user)

            return await writeFile(path, JSON.stringify(this.user, null, 2), "utf-8")
        } catch (error) {
            return error
        }
    }

    getUser = async (ID) => {
        try {
            //return await "SELECT * FROM TABLA WHERE IDUSER = " + ID Esto sería un ejemplo de como sería en mongo y que como lo homologaríamos.
        } catch (error) {
            return error
        }
    }
}

module.exports = UserDao