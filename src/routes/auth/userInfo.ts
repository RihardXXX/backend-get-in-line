import express from 'express'
import { Request, Response } from 'express'
import { isUserByToken } from '@src/utils/isUserByToken'
import { User, IUser } from '@src/models/auth'
import _ from 'lodash'

const userInfoRouter = express.Router()

/**
 * @swagger
 * tags:
 *   - name: Auth
 *     description: Маршруты для авторизации
 */

/**
 * @swagger
 * /auth/user-info:
 *   get:
 *     summary: Получение информации о пользователе на основании его куки.
 *     tags: [Auth]
 *     description: Получение информации о пользователе на основании его куки.
 *     responses:
 *       '200':
 *         description: Успешная аутентификация.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                       description: Имя пользователя.
 *                     email:
 *                       type: string
 *                       description: Email пользователя.
 *                     qrCode:
 *                       type: string
 *                       description: QR-код пользователя.
 *                     phone:
 *                       type: string
 *                       description: Телефон пользователя.
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

userInfoRouter.get('/', async (req: Request, res: Response) => {
    const token = req.cookies.token

    try {
        // получаем айди пользователя с кук
        const userId = await isUserByToken(token)

        if (!userId) {
            return res.status(500).json({
                message: 'данные в куках отсутствуют',
            })
        }

        // находим пользователя по айди его
        const user = await User.findOne<IUser | undefined>({ _id: userId })

        if (!user) {
            return res.status(500).json({
                message: 'пользователь не найден',
            })
        }

        // какие поля вернуть omit почему то дает сбой
        const resUser = _.pick(user, ['name', 'email', 'qrCode', 'phone'])

        return res.json({ user: resUser })
    } catch (e) {
        console.error((e as Error).message)
        res.status(500).send('Server Error')
    }
})

export default userInfoRouter
