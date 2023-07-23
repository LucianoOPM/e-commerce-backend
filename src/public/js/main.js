const socket = io()
const form = document.querySelector("#addForm")
const deleteProduct = document.querySelector("#deleteProducts")
const addBtn = document.querySelector('#addProducts')

addBtn.addEventListener('click', (e) => {
    e.preventDefault()

    const formValues = new FormData()

    formValues.append("title", form.title.value)
    formValues.append("description", form.description.value)
    formValues.append("price", form.price.value)
    formValues.append("thumbnail", form.thumbnail.files[0])
    formValues.append("code", form.code.value)
    formValues.append("stock", form.stock.value)
    formValues.append("status", form.status.checked ? true : false)
    formValues.append("category", form.category.value)

    fetch('http://localhost:8080/api/products', {
        method: 'POST',
        body: formValues
    })
        .then(res => res.json())
        .then(res => socket.emit("client:newProducts", res))
        .catch(err => console.log(err))


    form.reset()
})


socket.on('server:renderProducts', async (data) => {
    const { docs } = data
    let products = document.querySelector("#newProducts")

    let renderProducts = ''

    for (let value of docs) {
        renderProducts += `
        <h2>${value.title}</h2>
        <h3>${value.description}</h3>
        <p>ID: ${value._id}</p>
        <p>Costo: ${value.price}</p>
        <p>Disponibles: ${value.stock}</p>
        <p>${value.category}</p>
        <img src="${value.thumbnail}">
        <hr>
        `
    }
    products.innerHTML = renderProducts

})

const [idProduct, delButton] = deleteProduct

delButton.addEventListener('click', (e) => {
    e.preventDefault()


    const confirmar = confirm(`ATENCION!!!\n¿Esta seguro de eliminar el producto con ID: ${idProduct.value}?`)

    if (confirmar) {
        fetch(`http://localhost:8080/api/products/${idProduct.value}`, {
            method: 'DELETE'
        })
            .then(res => res.json())
            .then(res => {
                console.log(res);
                return socket.emit('client:deleteProduct')
            })
            .catch(err => console.log(err))
    }
    deleteProduct.reset()
})