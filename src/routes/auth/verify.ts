import express from 'express'
import { Request, Response } from 'express'
import speakeasy from 'speakeasy'
import { User } from '@src/models/auth'
import jwt from 'jsonwebtoken'

const verifyRouter = express.Router()

import dotenv from 'dotenv'
import process from 'process'

// Загрузка переменных окружения из файла .env
dotenv.config()

const jwtSecretKey = process.env.JWT_SECRET_KEY || 'foo'

/**
 * @swagger
 * /auth/verify:
 *   post:
 *     summary: подтверждение авторизации через одноразовый пароль.
 *     description: Verifies the OTP provided by the user.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: User's email address.
 *               otp:
 *                 type: string
 *                 description: One-time password provided by the user.
 *     responses:
 *       '200':
 *         description: Successful authentication.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message.
 *       '400':
 *         description: Bad request.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message.
 *       '500':
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message.
 */
verifyRouter.post('/', async (req: Request, res: Response) => {
    try {
        const { email, otp } = req.body

        // console.log('otp', otp)
        // console.log('email', email)

        const user = await User.findOne({ email })

        if (!user) {
            return res
                .status(400)
                .json({ message: 'Такой пользователь не существует' })
        }

        const verified = speakeasy.totp.verify({
            secret: user.secret,
            encoding: 'base32',
            window: 6,
            token: otp,
        })

        // console.log('verified: ', verified)

        if (verified) {
            // Генерируем JWT токен
            const token = jwt.sign({ userId: user._id }, jwtSecretKey, {
                expiresIn: '365d',
            })

            // Отправляем JWT в виде куки
            // фронт не может менять куки httpOnly: true
            res.cookie('token', token, { httpOnly: true })

            return res.json({ message: 'Авторизация пройдена успешно' })
        } else {
            return res.status(400).json({ message: 'Неверный код' })
        }
    } catch (err) {
        console.error((err as Error).message)
        res.status(500).send('Server Error')
    }
})

export default verifyRouter
