const delButton = document.querySelectorAll('#delete')
const upgradeButton = document.querySelectorAll('#upgrade')

delButton.forEach(button => {
  button.addEventListener('click', (e) => {
    e.preventDefault()


    fetch(`/api/users/${e.target.value}`, {
      method: "DELETE"
    })
      .then((res) => res.json())
      .then((res) => console.log(res))
      .catch(err => console.log(err))
  })
})

upgradeButton.forEach(button => {
  button.addEventListener('click', e => {
    e.preventDefault()
    fetch(`/api/users/premium/${e.target.value}`, {
      method: "PUT"
    })
      .then(res => res.json())
      .then(res => console.log(res))
      .catch(err => console.log(err))
  })
})