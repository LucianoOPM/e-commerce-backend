const buyBtn = document.querySelector('#buyCart')

buyBtn.addEventListener('click', e => {
  e.preventDefault()
  const cartId = buyBtn.value



  fetch(`/api/carts/${cartId}/purchase`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then(res => res.json())
    .then(res => console.log(res))
    .catch(err => console.log(err))
})