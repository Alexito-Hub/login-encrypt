const mongoose = require('mongoose');
const i18n = require('i18n');
const path = require('path');

const login = require('./encypt/login')

async function encrypt(config) {
 
    const uri = `mongodb+srv://${config.database.user}:${config.database.password}@serverdatadb.39fv13g.mongodb.net/${config.database.name}?retryWrites=true&w=majority`;
    mongoose.connect(uri)
        
   
    i18n.configure({
        locales: ['en', 'es', 'fr', 'de'],
        directory: path.join(__dirname, 'language'),
        defaultLocale: 'en'
    });
    
    const locale = config.config.language || 'en';
    i18n.setLocale(locale);
    const userConfigBb = config.database.user;
    const passwordConfigBb = config.database.password;
    const databaseConfigDb = config.database.name;

    if (!userConfigBb) {
        console.log(i18n.__('noUser'))
        mongoose.disconnect()
        return
    }
    if (!passwordConfigBb) {
        console.log(i18n.__('noPassword'))
        mongoose.disconnect()
        return
    }
    if (!databaseConfigDb) {
        console.log(i18n.__('noCollection'))
        mongoose.disconnect()
        return
    }


    login(locale)

}
mongoose.disconnect()

module.exports = encrypt;
