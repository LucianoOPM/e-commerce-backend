const alreadyLogged = (req, res, next) => {
    const { user } = req ?? null

    if (!user) return next()

    res.redirect('/products')
}
module.exports = alreadyLogged