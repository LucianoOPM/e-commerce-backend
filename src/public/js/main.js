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
    formValues.append("product", form.product.files[0])
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
    const { products: serverProducts, pagination } = data
    let products = document.querySelector("#newProducts")
    const pages = document.querySelector('#pagination')
    pages.innerHTML = `
        ${pagination.hasPrevPage ? "<button>Anterior</button>" : "<button disabled>Anterior</button>"}
        ${pagination.totalDocs}
        ${pagination.hasNextPage ? "<button>Siguiente</button>" : "<button disabled>Siguiente</button>"}
    `

    let renderProducts = serverProducts.map(products => {
        return `
        <h2>${products.title}</h2>
        <h3>${products.description}</h3>
        <img src="${products.thumbnails}">
        <p>ID: ${products.idProduct}</p>
        <p>Costo: ${products.price}</p>
        <p>Disponibles: ${products.stock}</p>
        <p>${products.category}</p>
        <hr>`
    })
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