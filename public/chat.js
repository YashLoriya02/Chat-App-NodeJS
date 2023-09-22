const socket = io('http://localhost:3000')
const inp = document.querySelector('input')
const messages = document.querySelector('#messages')
const sidebar = document.querySelector('#sidebar')
const messageTemplate = document.querySelector('#message-template').innerHTML
const locationTemplate = document.querySelector('#location-template').innerHTML
const sideBarTemplate = document.querySelector('#sidebar-template').innerHTML

const {username , room} = Qs.parse(location.search , {
    ignoreQueryPrefix : true
})

const autoScroll = () => {
    const newMessage = messages.lastElementChild

    const newMessageStyles = getComputedStyle(newMessage)
    const newMessageMargin = parseInt(newMessageStyles.marginBottom)
    const newMessageHeight = newMessage.offsetHeight + newMessageMargin

    const visibleHeight = messages.offsetHeight
    
    const containerHeight = messages.scrollHeight
    const scrollOffset = messages.scrollTop + visibleHeight

    if (containerHeight - newMessageHeight <= scrollOffset ) {
        messages.scrollTop = messages.scrollHeight
    }
}

socket.on('message' , (msg) => {
    const html = Mustache.render(messageTemplate , {
        message : msg.text ,
        timestamp : msg.createdAt ,
        username : msg.username ,
    })
    messages.insertAdjacentHTML('beforeend' , html)
    autoScroll()
})

socket.on('locationMessage' , (msg) => {
    const html = Mustache.render(locationTemplate , {
        url : msg.url ,
        createdAt : msg.createdAt,
        username : msg.username
    })
    messages.insertAdjacentHTML('beforeend' , html)
    autoScroll()
})

socket.on('roomData' , ({room , users}) => {
    const html = Mustache.render(sideBarTemplate , {
        room ,
        users,
    })
    sidebar.innerHTML =  html
})

const form = document.querySelector('#message-form').addEventListener('submit' , (e) => {
    e.preventDefault()
    const msg = e.target.elements.message.value
    socket.emit('sendMessage' , msg , () => {
        inp.value = ''
        inp.focus()
        console.log("Message Delivered.")
    })
})

document.querySelector('#send-location').addEventListener('click' , () => {
    if (!navigator.geolocation) {
        return alert("Geo-Location Not Supported.")
    }
    navigator.geolocation.getCurrentPosition((position) => {
        socket.emit('sendLocation' , position.coords.latitude , position.coords.longitude , () => {
            console.log("Location Shared.")
        })
    })
})

socket.emit('join' , {username , room} , (error) => {
    if (error) {
        alert(error)
        location.href = '/'
    }
})