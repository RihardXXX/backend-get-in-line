import express from 'express'
import bcrypt from 'bcrypt'
import { Request, Response } from 'express'
import { RecoveryPassword, User } from '@src/models/auth'

const newPasswordRouter = express.Router()

/**
 * @swagger
 * tags:
 *   - name: Auth
 *     description: Маршруты для авторизации
 */

/**
 * @swagger
 * /auth/new-password:
 *   post:
 *     summary: Отправка нового пароля для смены старого
 *     tags: [Auth]
 *     description: Отправка нового пароля для смены старого
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               password:
 *                 type: string
 *                 format: string
 *                 description: новый пароль
 *                 example: 084743
 *               _id:
 *                 type: string
 *                 format: string
 *                 description: запись в БД для поиска кому именно нужно сменить пароль
 *                 example: 6656e2f7cc8ec3ecb7a72a6f
 *             required:
 *               - password
 *               - _id
 *     responses:
 *       '200':
 *         description: Вы сменили пароль на новый
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Вы сменили пароль на новый
 *                   example: Вы сменили пароль на новый, зайдите пожалуйста под новым паролем
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

newPasswordRouter.post('/', async (req: Request, res: Response) => {
    try {
        const { _id, password } = req.body

        if (!_id || !password) {
            return res.status(500).json({
                message: '_id || пароль являются обязательным полем',
            })
        }

        // находим запись по айди
        const recoveryPassword = await RecoveryPassword.findOne({
            _id,
        })

        if (!recoveryPassword) {
            return res.status(500).json({
                message: 'такая запись не найдена',
            })
        }

        if (!recoveryPassword.status) {
            return res.status(500).json({
                message: 'режим смены пароля не активирован',
            })
        }

        const email = recoveryPassword.email

        const currentUser = await User.findOne({
            email,
        })

        if (!currentUser) {
            return res.status(500).json({
                message: 'пользователь с такой почтой не найден',
            })
        }

        // шифрование пароля перед сохранением в БД
        currentUser.password = await bcrypt.hash(password, 10)

        await currentUser.save()

        res.json({
            message: 'пароль пользователя сменен удачно',
        })
    } catch (err) {
        const message = (err as Error).message
        console.error(message) // изменение здесь
        res.status(500).send(`Server Error: ${message}`)
    }
})

export default newPasswordRouter
