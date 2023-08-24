const alreadyLogged = (req, res, next) => {
    const cookie = req.headers?.cookie ?? req.headers?.bearer

    if (cookie) {
        return res.status(400).redirect('/products')
    }

    next()
}
module.exports = alreadyLogged