const readlineSync = require('readline-sync');
const svgCaptcha = require('svg-captcha');
const mongoose = require('mongoose');
const figlet = require('figlet');
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const sharp = require('sharp');
const i18n = require('i18n');
const fs = require('fs');

const User = require('../model/user')

async function login(locale) {
    i18n.setLocale(locale);

    async function findUser(username, password) {
        const user = await User.findOne({ username: username }).select('+password');
        if (!user) {
            return null;
        }
    
        const validPassword = await bcrypt.compare(password, user.password);
        if (validPassword) {
            return user;
        } else {
            return null;
        }
    }
    
    
    async function generateCaptcha() {
        const captcha = svgCaptcha.create({
            width: 200,
            height: 60,
            fontSize: 50,
            letterSpacing: 6,
            noise: 2,
            color: true, 
            background: '#f0f0f0',
        });
        
        const captchaId = crypto.randomBytes(16).toString('hex'); 
        const captchaSvgPath = `captcha-${captchaId}.svg`;
        const captchaPngPath = `captcha-${captchaId}.png`;
        
        fs.writeFileSync(captchaSvgPath, captcha.data);
        
        await sharp(captchaSvgPath)
          .png()
          .toFile(captchaPngPath);
        
        fs.unlinkSync(captchaSvgPath);
        
        return { text: captcha.text, imagePath: captchaPngPath };
    }
    
    try {
        const captcha = await generateCaptcha();

        if (!fs.existsSync(captcha.imagePath) || fs.statSync(captcha.imagePath).size === 0) {
            console.log(i18n.__('errorCaptcha'));
            return;
        }

        figlet.text(captcha.text, {
            font: 'Standard', 
            horizontalLayout: 'default',
            verticalLayout: 'default'
        }, async (err, data) => {
            if (err) {
                console.log(i18n.__('errorGenerateCaptcha'), err);
                return;
            }
            console.log('CAPTCHA:');
            console.log(data);
            
            const captchaAnswer = readlineSync.question(i18n.__('captchaPrompt'));
            if (captchaAnswer !== captcha.text) {
                fs.unlinkSync(captcha.imagePath); 
                console.log(i18n.__('incorrectCaptcha'));
                return;
            }
            
            const username = readlineSync.question(i18n.__('enterUsername'));
            
            const userDb = await User.findOne({username});
            if (!userDb) {
                console.log(i18n.__('incorrectUsername'));
                return;
            }
            
            const password = readlineSync.question(i18n.__('enterPassword'), {
                hideEchoBack: true,
                mask: ''
            });


            const user = await User.findOne({ username: username }).select('+password');
            const validPassword = await bcrypt.compare(password, user.password);
            if (!validPassword) {
                console.log(i18n.__('incorrectPassword'));
                return;
            }


            await findUser(username, password).then(user => {
                if (user) {
                    console.log(i18n.__('loginSuccessful'));
                } else {
                    console.log(i18n.__('incorrectCredentials'));
                }
            }).catch(err => {
                console.error(i18n.__('errorLogin'), err);
            }).finally(() => {
                fs.unlinkSync(captcha.imagePath);
                mongoose.disconnect()
            });

        });
    } catch (err) {
        console.error('errorGenerateCaptcha', err);
    }
}

module.exports = login;