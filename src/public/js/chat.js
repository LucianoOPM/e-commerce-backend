const socket = io()
const sendBtn = document.querySelector('#send-bttn')
const text = document.querySelector('#text')
const chat = document.querySelector('#chatArea')

sendBtn.addEventListener('click', (e) => {
    e.preventDefault()
    const message = text.value
    socket.emit('client:message', message)
    text.value = ""
})

socket.on('server:message', async (data) => {
    const messageFormat = `${data.first_name} says: ${data.message}`

    chat.innerHTML += `${messageFormat}\n`
})

socket.on('connect_error', (err) => {
    console.log(err.message)
})