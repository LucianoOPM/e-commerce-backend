const newPassForm = document.querySelector('#newPassword')
const passBtn = document.querySelector('#passwordButton')
const path = window.location.pathname
const UID = path.split('/')[2]
const token = path.split('/')[3]

passBtn.addEventListener('click', (e) => {
    e.preventDefault()

    const [newPass, confirmPass] = newPassForm

    if (newPass.value.length < 8 || confirmPass.value.length < 8) {
        Swal.fire({
            title: 'Warning',
            icon: 'warning',
            text: 'password must be at least more than 8 letters length'
        })
    }

    if (newPass.value !== confirmPass.value) {
        Swal.fire({
            title: 'Error',
            icon: 'error',
            text: 'Password values doesnt match'
        })
    }

    fetch(`http://localhost:8080/api/users/restore/${UID}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ password: newPass.value })
    })
        .then(res => res.json())
        .then(info => console.log(info))
        .catch(err => console.log(err))

    newPassForm.reset()
})
