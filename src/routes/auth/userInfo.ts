import express from 'express'
import { Request, Response } from 'express'
import { isUserByToken } from '@src/utils/isUserByToken'

const userInfoRouter = express.Router()

import dotenv from 'dotenv'
import process from 'process'

// Загрузка переменных окружения из файла .env
dotenv.config()

/**
 * @swagger
 * /auth/user-info:
 *   get:
 *     summary: получение информации о пользователе на основании его кук.
 *     description: получение информации о пользователе на основании его кук.
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
userInfoRouter.get('/', async (req: Request, res: Response) => {
    const token = req.cookies.token

    try {
        await isUserByToken(token)

        return res.json({ message: 'данные юзера прилетят сюда' })
    } catch (e) {
        console.error((e as Error).message)
        res.status(500).send('Server Error')
    }
})

export default userInfoRouter
