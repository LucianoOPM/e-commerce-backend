const buyBtn = document.querySelector('#buyCart')

if (buyBtn) {
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
      .then(res => {
        console.log(res)
        Swal.fire({
          title: "Success",
          icon: "success",
          text: "Products were purchased successfully",
          confirmButtonText: "OK"
        }).then(result => {
          if (result.isConfirmed || result.isDismissed || result.isDenied) {
            window.location.reload()
          }
        })
      })
      .catch(err => {
        console.log(err)
        Swal.fire({
          title: "Error",
          icon: "error",
          text: "Something gone wrong"
        })
      })
  })
}

const logoutButton = document.querySelector('#logout')

logoutButton.addEventListener('click', (e) => {
  e.preventDefault()

  fetch('/api/session/logout', {
    method: "POST",
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then(data => {
      window.location.href = "/products"
    })
    .catch(err => console.log(err))
})
