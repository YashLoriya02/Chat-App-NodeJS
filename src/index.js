const path = require('path')
const express = require("express")
const { createServer } = require("http")
const { Server } = require("socket.io")
const { generateMessage, generateLocationMessage } = require('./utils/messages.js')
const { addUser, getUser, getUsers, removeUser } = require('./utils/users.js')

const port = 3000
const app = express();
const server = createServer(app)
const io = new Server(server)

const directory = path.join(__dirname, '../public')

app.use(express.static(directory))

io.on("connection", (socket) => {
    socket.on('join', ({ username, room }, callback) => {
        const { error, user } = addUser({ id: socket.id, username, room })

        if (error) {
            return callback(error)
        }
        socket.join(user.room)
        socket.emit('message', generateMessage(`Welcome ${user.username}` , user.username))
        socket.to(user.room).emit('message', generateMessage(`${user.username} has Joined` , user.username))
        io.to(user.room).emit('roomData' , {
            room : user.room ,
            users : getUsers(user.room)
        })
        callback()
    })

    socket.on('sendMessage', (msg, callback) => {
        const user = getUser(socket.id)
        io.to(user.room).emit('message', generateMessage(msg , user.username))
        callback()
    })

    socket.on('sendLocation', (m1, m2, callback) => {
        const user = getUser(socket.id)
        socket.broadcast.to(user.room).emit('locationMessage', generateLocationMessage(`https://google.com/maps?q=${m1},${m2}` , user.username))
        callback()
    })

    socket.on('disconnect', () => {
        const user = removeUser(socket.id)
        if (user) {
            io.to(user.room).emit('message', generateMessage(`${user.username} has Left.` , user.username))
        }
        io.to(user.room).emit('roomData' , {
            room : user.room ,
            users : getUsers(user.room)
        })
    })
})

server.listen(port, () => {
    console.log("Server Running on Port " + port)
})
