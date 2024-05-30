import express from 'express'
import { Request, Response } from 'express'
import { RecoveryPassword } from '@src/models/auth'
import speakeasy from 'speakeasy'

const changePasswordRouter = express.Router()

/**
 * @swagger
 * tags:
 *   - name: Auth
 *     description: Маршруты для авторизации
 */

/**
 * @swagger
 * /auth/change-password:
 *   post:
 *     summary: Отправка кода для активации режима смены пароля
 *     tags: [Auth]
 *     description: Отправка кода для активации режима смены пароля
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               slug:
 *                 type: string
 *                 format: string
 *                 description: код активации
 *                 example: 084743
 *             required:
 *               - slug
 *     responses:
 *       '200':
 *         description: Смена режима mode in status true for
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: смена пароля активирована
 *                   example: Вам отправлена ссылка на электронную почту, перейдите по ней, чтобы сменить пароль
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

changePasswordRouter.post('/', async (req: Request, res: Response) => {
    try {
        const { _id, otp } = req.body

        if (!_id || !otp) {
            return res.status(500).json({
                message: '_id || otp являются обязательным полем',
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

        console.log('recoveryPassword?.secretKey', recoveryPassword?.secretKey)
        console.log('otp', otp)

        // внимание пароль одноразовый) дважды не пропустит
        // то есть если перезагрузит страницу не активировав его то словит теоретически ошибку
        const verified = speakeasy.totp.verify({
            secret: recoveryPassword?.secretKey as string,
            encoding: 'base32',
            window: 6,
            token: otp,
        })

        console.log('verified: ', verified)

        if (!verified) {
            return res.status(500).json({
                message: 'одноразовый пароль неверный',
            })
        }

        // одноразовый пароль совпал при дешифровании и поэтому и можем в записи сменить статус
        // если статус изменен то при отправке пароля мы его сменим пользователю
        recoveryPassword.status = true
        await recoveryPassword.save()

        res.json({
            message: 'режим смены пароля активирован',
        })
    } catch (err) {
        const message = (err as Error).message
        console.error(message) // изменение здесь
        res.status(500).send(`Server Error: ${message}`)
    }
})

export default changePasswordRouter
