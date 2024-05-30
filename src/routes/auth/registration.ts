import express from 'express'
import { Request, Response } from 'express'
import { User, IUser } from '@src/models/auth/User'
import { sendOnEmail } from '@src/utils/nodemailerUtils'
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
const domain = process.env.DOMAIN
const port = process.env.PORT

/**
 * @swagger
 * tags:
 *   - name: Auth
 *     description: Маршруты для авторизации
 */

/**
 * @swagger
 * /auth/registration:
 *   post:
 *     summary: Регистрация пользователя
 *     tags: [Auth]
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
 *               phone:
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
        const { name, email, password, phone } = req.body

        // console.log(req.body)

        if (!name || !email || !password) {
            return res.status(500).json({
                message: 'имя, почта и пароль являются обязательными полями ',
            })
        }

        const isValidEmail = emailRegex.test(email)

        if (!isValidEmail) {
            return res.status(500).json({
                message: 'неверный формат электронной почты',
            })
        }

        const isUser = await User.findOne({ email })

        if (isUser) {
            return res
                .status(500)
                .json({ message: 'Пользователь с такой почтой существует' })
        }

        const isFindName = await User.findOne({ name })

        if (isFindName) {
            return res.status(500).json({
                message:
                    'Пользователь с таким именем существует, смените пожалуйста имя',
            })
        }

        // const isPhoneCorrect = Number(phone.length) === 11
        //
        // if (!isPhoneCorrect) {
        //     return res
        //         .status(400)
        //         .json({ message: 'Номер телефона должен состоять из 11 цифр' })
        // }

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
            phone: phone ?? '',
        })

        // сохранение пользователя
        await user.save()

        // // Получаем размер документа в байтах
        // const sizeInBytes = Buffer.byteLength(JSON.stringify(user));
        // console.log(`Размер документа в байтах: ${sizeInBytes}`);

        // Отправляем письмо для подтверждения регистрации
        const message = `<p>Пожалуйста кликните по ссылке и подтвердите авторизацию в приложении get-in-line 
                    <a href="${domain}:${port}/auth/confirm/${confirmationCode}">подтвердить авторизацию</a>>
                </p>
               `
        await sendOnEmail(email, message)

        res.json({
            message: `Регистрация прошла успешно, пожалуйста подтвердите вашу авторизацию кликнув на ссылку в письме от ${emailFrom} (не забудьте проверить папку спам)`,
        })
    } catch (err) {
        const message = (err as Error).message
        console.error(message) // изменение здесь
        res.status(500).send(`Server Error: ${message}`)
    }
})

export default registerRouter
