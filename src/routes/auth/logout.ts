import express from 'express'
import { Request, Response } from 'express'
import { Session } from '@src/models/auth'
import { isUserByToken } from '@src/utils/isUserByToken'

const logoutRouter = express.Router()

/**
 * @swagger
 * /auth/logout:
 *   get:
 *     summary: Выход пользователя из системы.
 *     description: Осуществляет выход пользователя из системы.
 *     responses:
 *       '200':
 *         description: Успешное завершение сеанса пользователя.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   description: Статус выхода из системы.
 *       '400':
 *         description: Неверный запрос.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Сообщение об ошибке.
 *       '500':
 *         description: Внутренняя ошибка сервера.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Сообщение об ошибке.
 */

logoutRouter.get('/', async (req: Request, res: Response) => {
    const token = req.cookies.token
    try {
        // получаем айди пользователя с кук
        const userId = await isUserByToken(token)

        if (!userId) {
            return res.status(400).json({
                message: 'данные в куках отсутствуют',
            })
        }

        // Удаление сеанса из базы данных
        await Session.deleteOne({ userID: userId })

        return res.json({ status: 'logout true' })
    } catch (e) {
        console.log('logout error: ', (e as Error).message)
    }
})

export default logoutRouter
