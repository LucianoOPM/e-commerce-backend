let loginForm = document.querySelector('#loginForm')
let loginBttn = document.querySelector('#loginButton')

loginBttn.addEventListener('click', (e) => {
    e.preventDefault()

    const { email, password } = loginForm

    const loginValues = {
        email: email.value,
        password: password.value
    }

    fetch('/api/session/login', {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(loginValues)
    })
        .then(res => {
            if (res.status === 200) {
                return res.json()
            }
            throw new Error("No se pudo iniciar la sesion")
        })
        .then(_ => {
            return window.location.href = '/products'
        })
        .catch(err => alert(err.message))
})