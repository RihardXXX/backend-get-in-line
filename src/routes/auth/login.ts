import express from 'express'
import { Request, Response } from 'express'
import { User } from '@src/models/auth/User'
import bcrypt from 'bcrypt'
import speakeasy from 'speakeasy'
import { sendSMS } from '@src/utils/sendSms'

const loginRouter = express.Router()

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Аутентификация пользователя
 *     description: Аутентификация пользователя по электронной почте и паролю. После успешной аутентификации отправляется одноразовый пароль по SMS.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Электронная почта пользователя
 *                 example: example@example.com
 *               password:
 *                 type: string
 *                 description: Пароль пользователя
 *                 example: password123
 *             required:
 *               - email
 *               - password
 *     responses:
 *       '200':
 *         description: Успешная аутентификация
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Сообщение об успешной отправке одноразового пароля
 *                   example: Одноразовый пароль успешно отправлен Вам
 *       '400':
 *         description: Неверный логин или пароль
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Сообщение об ошибке аутентификации
 *                   example: Неверный логин (почта) или Неверный пароль
 *       '500':
 *         description: Внутренняя ошибка сервера
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Сообщение об ошибке сервера
 *                   example: Server Error
 */
loginRouter.post('/', async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body

        if (!email || !password) {
            return res.status(400).json({
                message: 'почта и пароль являются обязательными полями ',
            })
        }

        const user = await User.findOne({ email })

        if (!user) {
            return res
                .status(400)
                .json({ message: 'такой почты не существует' })
        }

        const isPasswordValid = await bcrypt.compare(password, user.password)

        if (!isPasswordValid) {
            return res.status(400).json({ message: 'неверный пароль' })
        }

        const token = speakeasy.totp({
            secret: user.secret,
            encoding: 'base32',
        })

        // Отправляем одноразовый пароль по SMS
        console.log('token: ', token)

        await sendSMS(user.phone, token)

        // sendSMS(user.phone, token);
        res.json({
            message: 'Вам отправлен одноразовый пароль, введите его в форму',
        })
    } catch (err) {
        console.error((err as Error).message)
        res.status(500).send('Server Error')
    }
})

export default loginRouter