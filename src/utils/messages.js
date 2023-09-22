const generateMessage = (text , username) => {
    return {
        text ,
        createdAt : new Date().toString().split(' ')[4].slice(0,5) ,
        username
    }
}

const generateLocationMessage = (url , username) => {
    return {
        url ,
        createdAt : new Date().toString().split(' ')[4].slice(0,5) ,
        username
    }
}

module.exports = {
    generateMessage ,
    generateLocationMessage
}