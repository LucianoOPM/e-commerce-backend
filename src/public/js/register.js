let registerForm = document.querySelector('#registerForm')
let regButton = document.querySelector('#registerbutton')

regButton.addEventListener('click', (e) => {
    e.preventDefault()

    const [first_name, last_name, email, birthdate, password] = registerForm

    const newUser = {
        first_name: first_name.value,
        last_name: last_name.value,
        email: email.value,
        birthdate: birthdate.value,
        password: password.value
    }


    fetch('/api/users', {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(newUser)
    })
        .then(res => {
            if (res.status === 200) {
                return res.json()
            }
            throw new Error("No se pudo registrar el usuario")
        })
        .then(res => {
            return window.location.href = '/login'
        })
        .catch(err => alert(err.message))
})