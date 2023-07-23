const hasNextPage = (URL, nextPage, actualPage) => {
    return URL.endsWith("products") || URL.endsWith("products/") ? `${URL}?page=${nextPage}` : URL.includes("page") ? URL.replace(`page=${actualPage}`, `page=${nextPage}`) : `${URL}&page=${nextPage}`
}

const hasPrevPage = (URL, prevPage, actualPage) => {
    return URL.endsWith("products") || URL.endsWith("products/") ? `${URL}?page=${prevPage}` : URL.includes("page") ? URL.replace(`page=${actualPage}`, `page=${prevPage}`) : `${URL}&page=${prevPage}`
}

module.exports = {
    hasNextPage,
    hasPrevPage
}