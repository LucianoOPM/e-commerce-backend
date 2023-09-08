const logout = document.querySelector('#logout')

logout.addEventListener('click', e => {
  e.preventDefault()

  fetch('/api/session/logout', {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    }
  })
    .then(res => {
      return window.location.href = '/products'
    })
    .catch(err => console.log(err))
})