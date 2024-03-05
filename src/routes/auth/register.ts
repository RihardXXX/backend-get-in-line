import express from 'express'
import { Request, Response } from 'express'
import { User, IUser } from '@src/models/auth/User'
import { generateAndSaveQRCode } from '@src/utils/yandexDisk'
import { sendConfirmationEmail } from '@src/utils/nodemailerUtils'
import bcrypt from 'bcrypt'
import speakeasy from 'speakeasy'
import { v4 as uuidv4 } from 'uuid'

const registerRouter = express.Router()

import dotenv from 'dotenv'
import process from 'process'

// Загрузка переменных окружения из файла .env
dotenv.config()

const emailFrom = process.env.LOGIN_NODEMAILER

/**
 * @swagger
 * /auth/register:
 *   get:
 *     summary: регистрация пользователя
 *     description: регистрируем нового пользователя
 *     responses:
 *       200:
 *         description: Успешный ответ. Возвращает сообщение о регистрации и токен
 */
registerRouter.post('/', async (req: Request, res: Response) => {
    try {
        const { name, email, password } = req.body

        if (!name || !email || !password) {
            return res.status(400).json({
                message: 'имя, почта и пароль являются обязательными полями ',
            })
        }

        let user = await User.findOne({ email })

        if (user) {
            return res
                .status(400)
                .json({ message: 'Пользователь с такой почтой существует' })
        }

        // шифрование пароля перед сохранением в БД
        const hashedPassword = await bcrypt.hash(password, 10)
        // шифрование секретной фразы для одноразовых паролей
        const secret = speakeasy.generateSecret({ length: 20 })
        // генерация строки для подтверждения авторизации
        const confirmationCode = uuidv4() // Генерируем код подтверждения

        user = new User<IUser>({
            name,
            email,
            password: hashedPassword,
            avatar: '',
            secret: secret.base32,
            confirmationCode,
            qrCode: '',
        })

        // сохранение пользователя
        await user.save()

        // генерация qrcode и сохранение его как в БД так и на яндекс диске

        // Отправляем письмо для подтверждения регистрации
        await sendConfirmationEmail(email, confirmationCode)
        res.json({
            message: `Регистрация прошла успешно,
         пожалуйста подтвердите вашу авторизация кликнув на ссылку в письме от ${emailFrom}`,
        })
    } catch (err) {
        console.error((err as Error).message) // изменение здесь
        res.status(500).send('Server Error')
    }
})

export default registerRouter
