class CustomErrors extends Error {
    constructor({ name, message, code, cause }) {
        super(message)
        this.name = name
        this.code = code
        this.cause = cause
    }

    static productError({ name = 'Error', cause, message, code = 1 }) {
        throw new CustomErrors({ message, name, code, cause })
    }

    /* 
    static userError()
    static serverError() 
    */
}

module.exports = CustomErrors