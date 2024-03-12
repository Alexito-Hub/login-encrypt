require('dotenv').config()
const encrypt = require('./index')

encrypt({
    database: {
        user: process.env.MONGODB_USER,
        password: process.env.PASSWORD_DB,
        name: 'Node'
    },
    config: {
        language: 'de'
    }
})
