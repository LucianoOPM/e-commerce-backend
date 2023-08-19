const fs = require('node:fs/promises')

const createFolder = async (path) => {
  try {
    await fs.mkdir(path, { recursive: true })
  } catch (error) {
    throw new Error(error)
  }
}

module.exports = createFolder