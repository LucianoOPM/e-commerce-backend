const logoutBttn = document.querySelector('#logout')
const logoutSession = (e) => {
    e.preventDefault()


    fetch('/api/session/logout', {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        }
    })
        .then(res => console.log(res))
        .then(res => {
            return window.location.href = '/products'
        })
        .catch(err => console.log(err))
}


if (logoutBttn) {
    logoutBttn.addEventListener('click', logoutSession)
}