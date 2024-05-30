import express from 'express'
import { Request, Response } from 'express'
import { User } from '@src/models/auth'
import bcrypt from 'bcrypt'
import speakeasy from 'speakeasy'
import { sendOnEmail } from '@src/utils/nodemailerUtils'

const loginRouter = express.Router()

/**
 * @swagger
 * tags:
 *   - name: Auth
 *     description: Маршруты для авторизации
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Аутентификация пользователя
 *     tags: [Auth]
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
            return res.status(500).json({
                message: 'почта и пароль являются обязательными полями ',
            })
        }

        const user = await User.findOne({ email })

        if (!user) {
            return res
                .status(500)
                .json({ message: 'такой почты не существует' })
        }

        const isPasswordValid = await bcrypt.compare(password, user.password)

        if (!isPasswordValid) {
            return res.status(500).json({ message: 'неверный пароль' })
        }

        const code = speakeasy.totp({
            secret: user.secret,
            encoding: 'base32',
        })

        // await sendSms(user.phone, code)
        await sendOnEmail(
            email,
            `Введи Ваш одноразовый пароль ${code} авторизации в форму `,
        )

        // sendSMS(user.phone, token);
        res.json({
            message: `Вам отправлен одноразовый пароль на вашу электронную почту ${email}, введите его в форму`,
        })
    } catch (err) {
        console.error((err as Error).message)
        res.status(500).send('Server Error')
    }
})

export default loginRouter
