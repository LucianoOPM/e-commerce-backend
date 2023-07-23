const { hasNextPage: next, hasPrevPage: prev } = require("./urlNextAndPrev");

const pageBuilder = (req, pagination) => {
    const { totalDocs, limit, totalPages, page, pagingCounter, hasPrevPage, hasNextPage, prevPage, nextPage } = pagination
    const prevUrl = prev(req.originalUrl, prevPage, page)
    const nextUrl = next(req.originalUrl, nextPage, page)


    return {
        totalDocs,
        limit,
        totalPages: totalPages,
        prevPage: prevPage,
        nextPage: nextPage,
        page: page,
        hasPrevPage: hasPrevPage,
        hasNextPage: hasNextPage,
        prevLink: hasPrevPage ? prevUrl : null,
        nextLink: hasNextPage ? nextUrl : null
    }
}

module.exports = pageBuilder
