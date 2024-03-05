import express from 'express'
import { Request, Response } from 'express'
import { User, IUser } from '@src/models/auth/User'
import { sendConfirmationEmail } from '@src/utils/nodemailerUtils'
import bcrypt from 'bcrypt'
import speakeasy from 'speakeasy'
import { v4 as uuidv4 } from 'uuid'
import { emailRegex } from '@src/utils/baseUtils'

const registerRouter = express.Router()

import dotenv from 'dotenv'
import process from 'process'

// Загрузка переменных окружения из файла .env
dotenv.config()

const emailFrom = process.env.LOGIN_NODEMAILER

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Регистрация пользователя
 *     description: Регистрирует нового пользователя.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *             required:
 *               - name
 *               - email
 *               - password
 *     responses:
 *       200:
 *         description: Успешная регистрация. Возвращает сообщение о регистрации и токен.
 *       400:
 *         description: Некорректный запрос. Отсутствуют обязательные поля или пользователь с такой почтой уже существует.
 *       500:
 *         description: Внутренняя ошибка сервера.
 */
registerRouter.post('/', async (req: Request, res: Response) => {
    try {
        const { name, email, password } = req.body

        if (!name || !email || !password) {
            return res.status(400).json({
                message: 'имя, почта и пароль являются обязательными полями ',
            })
        }

        const isValidEmail = emailRegex.test(email)

        if (!isValidEmail) {
            return res.status(400).json({
                message: 'неверный формат электронной почты',
            })
        }

        const isUser = await User.findOne({ email })

        if (isUser) {
            return res
                .status(400)
                .json({ message: 'Пользователь с такой почтой существует' })
        }

        const isFindName = await User.findOne({ name })

        if (isFindName) {
            return res.status(400).json({
                message:
                    'Пользователь с таким именем существует, смените пожалуйста имя',
            })
        }

        // шифрование пароля перед сохранением в БД
        const hashedPassword = await bcrypt.hash(password, 10)
        // шифрование секретной фразы для одноразовых паролей
        const secret = speakeasy.generateSecret({ length: 20 })
        // генерация строки для подтверждения авторизации
        const confirmationCode = uuidv4() // Генерируем код подтверждения

        const user = new User<IUser>({
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

        // Отправляем письмо для подтверждения регистрации
        await sendConfirmationEmail(email, confirmationCode)

        res.json({
            message: `Регистрация прошла успешно,
         пожалуйста подтвердите вашу авторизация кликнув на ссылку в письме от ${emailFrom}`,
        })
    } catch (err) {
        const message = (err as Error).message
        console.error(message) // изменение здесь
        res.status(500).send(`Server Error: ${message}`)
    }
})

export default registerRouter
