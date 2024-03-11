import express from 'express'
import { Request, Response } from 'express'
import speakeasy from 'speakeasy'
import { User } from '@src/models/auth/User'

const verifyRouter = express.Router()

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
