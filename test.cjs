require('dotenv').config()
const encrypt = require('./encrypt.cjs')

encrypt({
    database: {
        user: process.env.MONGODB_USER,
        password: process.env.MONGODB_PASSWORD,
        name: 'Node'
    },
    language: 'es',
    connection: {
        email: process.env.CONNECTION_EMAIL,
        password: process.env.CONNECTION_PASSWORD,
        name: 'Zippo'
    }
})
