const authotization = role => async (req, res, next) => {
    if (!req.user) return res.status(401).send({ status: 'error', message: 'Unauthorized' })
    if (req.user.role !== role) return res.status(403).send({ status: 'error', error: 'No permissions' })

    next()
}

module.exports = authotization