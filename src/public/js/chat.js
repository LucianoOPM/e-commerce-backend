const socket = io()
const sendBtn = document.querySelector('#send-bttn')
const text = document.querySelector('#text')

sendBtn.addEventListener('click', (e) => {
    e.preventDefault()
    socket.emit('handshake', "hola mundo")
    text.value = ""
})

socket.on('message', (data) => {
    console.log(data)
})