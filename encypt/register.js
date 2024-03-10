const readlineSync = require('readline-sync');
const bcrypt = require('bcrypt');
const i18n = require('i18n');
const mongoose = require('mongoose')
const User = require('../model/user');


async function register(locale) {
    i18n.setLocale(locale);

    try {

        console.log(i18n.__('register'))
        const username = readlineSync.question(i18n.__('enterUsername'));

        const existingUser = await User.findOne({ username });
        if (existingUser) {
            console.log(i18n.__('existingUser'));
            mongoose.disconnect()
            return;
        }

        const password = readlineSync.question(i18n.__('enterPassword'), {
            hideEchoBack: true,
            mask: ''
        });

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, password: hashedPassword });
        await newUser.save();
        console.log(i18n.__('registerSuccessful'));
        mongoose.disconnect()
    } catch (err) {
        console.error(i18n.__('incorrectRegistration'), err);
    }
}

module.exports = register;