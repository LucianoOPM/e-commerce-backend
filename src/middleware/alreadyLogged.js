const alreadyLogged = (req, res, next) => {
    if ('cookie' in req.headers || 'bearer' in req.headers) {
        return res.status(400).redirect('/products')
    }
    next()
}
module.exports = alreadyLogged