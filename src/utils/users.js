const users = []

// Add User
const addUser = ({ id, username, room }) => {
    username = username.trim().toLowerCase()
    room = room.trim()

    if (!username || !room) {
        return {
            error: "Username and Room are Required."
        }
    }

    const exisitingUser = users.find((user) => {
        return user.room === room && user.username === username
    })
    if (exisitingUser) {
        return {
            error: "Username Already Exists. Choose Another Username"
        }
    }

    const splitted = username.split("")
    username = username[0].toUpperCase()

    for (let index = 1; index < splitted.length; index++) {
        username = username + splitted[index]
    }

    const user = { id, username, room }
    users.push(user)
    return { user }
}

// Remove User

const removeUser = (id) => {
    const index = users.findIndex((user) => user.id === id)

    if (index !== -1) {
        return users.splice(index, 1)[0]
    }
    return {
        error: "User Does not Exist."
    }
}

// Get User

const getUser = (id) => {
    const user = users.find((user_id) => {
        return user_id.id === id
    })

    if (user) {
        return user
    }
    return {
        error: "User Does Not Exist."
    }
}

// Get Users

const getUsers = (room) => {
    const userRoom = users.filter((user) => {
        return user.room === room
    })

    if (userRoom.length !== 0) {
        return userRoom
    }
    else if (userRoom.length === 0) {
        return {
            error: "Room Does not Exist."
        }
    }
}


module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsers
}