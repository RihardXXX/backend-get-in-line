import nodemailer from 'nodemailer'

import dotenv from 'dotenv'
import process from 'process'

// Загрузка переменных окружения из файла .env
dotenv.config()

const service = process.env.SERVICE_NODEMAILER
const login = process.env.LOGIN_NODEMAILER
const password = process.env.PASSWORD_NODEMAILER
const domain = process.env.DOMAIN
const port = process.env.PORT

// Создайте объект транспорта для отправки электронных писем
const transporter = nodemailer.createTransport({
    service: service,
    auth: {
        user: login,
        pass: password,
    },
})

// Генерация и отправка письма для подтверждения регистрации
async function sendConfirmationEmail(email: string, confirmationCode: string) {
    const mailOptions = {
        from: login,
        to: email,
        subject: 'Подтверждение авторизации в приложении',
        html: `<p>Пожалуйста кликните по ссылке и подтвердите авторизацию в приложении get-in-line 
                    <a href="${domain}:${port}/confirm/${confirmationCode}">подтвердить авторизацию</a>>
                </p>
               `,
    }

    try {
        await transporter.sendMail(mailOptions)
    } catch (e) {
        console.error('Ошибка отправки письма:', e)
    }
}

export { sendConfirmationEmail }
