class UserDto {
    constructor(user) {
        this.userID = user._id.toString()
        this.first_name = user.first_name
        this.last_name = user.last_name
        this.cartID = user.cartID.toString()
        this.role = user.role
        this.age = this.#ageCalculator(user.birthdate)
        this.password = user.password
        this.email = user.email
        this.documents = user.documents
    }

    #ageCalculator = (birthdate) => {
        const age = new Date(birthdate).getFullYear()
        const actualYear = new Date().getFullYear()
        return actualYear - age;
    }
}

module.exports = UserDto