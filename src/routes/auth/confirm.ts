import express from 'express'
import { Request, Response } from 'express'
import { User } from '@src/models/auth'
import qrcode from 'qrcode' // Подключаем библиотеку для генерации QR-кода

const confirmRouter = express.Router()

/**
 * @swagger
 * tags:
 *   - name: Auth
 *     description: Маршруты для авторизации
 */

/**
 * @swagger
 * /auth/confirm/{confirmationCode}:
 *   get:
 *     summary: Подтверждение регистрации пользователя
 *     tags: [Auth]
 *     description: Подтверждает регистрацию пользователя по коду подтверждения и генерирует QR-код.
 *     parameters:
 *       - in: path
 *         name: confirmationCode
 *         required: true
 *         description: Код подтверждения регистрации.
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Успешное подтверждение регистрации.
 *       '400':
 *         description: Ошибка при некорректном запросе или неверном коде подтверждения.
 *       '500':
 *         description: Внутренняя ошибка сервера.
 */
confirmRouter.get('/:confirmationCode', async (req: Request, res: Response) => {
    try {
        const { confirmationCode } = req.params

        if (!confirmationCode) {
            return res
                .status(404)
                .json({ message: 'Код подтверждения не предоставлен' })
        }

        const user = await User.findOne({ confirmationCode })

        if (!user) {
            return res
                .status(404)
                .json({ message: 'Неверный код подтверждения' })
        }

        // Подтверждаем регистрацию
        user.confirmationCode = 'confirmed'

        // Генерация и заполнение qrCode в формате base64 после подтверждения регистрации
        const userId = String(user._id)
        user.qrCode = await qrcode.toDataURL(`User ID: ${userId}`) // Получаем URL-адрес данных для QR-кода

        await user.save()

        // Получаем размер документа в байтах
        // const sizeInBytes = Buffer.byteLength(JSON.stringify(user));
        // console.log(`Размер документа в байтах: ${sizeInBytes}`);

        res.send(
            '<h2>Вы подтвердили полностью регистрацию <br> и можете полноценно приступить к работе</h2>',
        )
    } catch (err) {
        console.error((err as Error).message)
        res.status(500).send('Ошибка подтверждения аккаунта')
    }
})

export default confirmRouter
