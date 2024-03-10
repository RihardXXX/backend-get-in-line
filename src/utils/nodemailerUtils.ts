import nodemailer from 'nodemailer'

import dotenv from 'dotenv'
import process from 'process'

// Загрузка переменных окружения из файла .env
dotenv.config()

const service = process.env.SERVICE_NODEMAILER
const login = process.env.LOGIN_NODEMAILER
const password = process.env.PASSWORD_NODEMAILER

// Создайте объект транспорта для отправки электронных писем
const transporter = nodemailer.createTransport({
    service: service,
    auth: {
        user: login,
        pass: password,
    },
})

// Генерация и отправка письма для подтверждения регистрации
async function sendOnEmail(email: string, message: string) {
    const mailOptions = {
        from: login,
        to: email,
        subject: 'Подтверждение авторизации в приложении',
        html: message,
    }

    try {
        await transporter.sendMail(mailOptions)
    } catch (e) {
        console.error('Ошибка отправки письма:', e)
    }
}

export { sendOnEmail }
