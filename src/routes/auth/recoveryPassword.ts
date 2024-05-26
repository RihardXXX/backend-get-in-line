import express from 'express'
import { Request, Response } from 'express'
import { User } from '@src/models/auth'
import { RecoveryPassword, RecoveryPasswordInterface } from '@src/models/auth'
import { emailRegex } from '@src/utils/baseUtils'
import speakeasy from 'speakeasy'
import { sendOnEmail } from '@src/utils/nodemailerUtils'

import dotenv from 'dotenv'
import process from 'process'

// Загрузка переменных окружения из файла .env
dotenv.config()

const emailFrom = process.env.LOGIN_NODEMAILER
const domainFrontend = process.env.DOMAIN_FRONTEND
const portFrontend = process.env.PORT_FRONTEND

const recoveryPasswordRouter = express.Router()

/**
 * @swagger
 * /auth/recovery-password:
 *   post:
 *     summary: Отправка ссылки на электронную почту пользователя
 *     description: Отправка ссылки на электронную почту пользователя
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
 *             required:
 *               - email
 *               - password
 *     responses:
 *       '200':
 *         description: Успешная отправка сгенерированной ссылки на почту
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Сообщение об успешной отправке ссылки на почту
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

recoveryPasswordRouter.post('/', async (req: Request, res: Response) => {
    try {
        const { email } = req.body

        if (!email) {
            return res.status(500).json({
                message: 'почта являются обязательным полем',
            })
        }

        const isValidEmail = emailRegex.test(email)

        if (!isValidEmail) {
            return res.status(500).json({
                message: 'неверный формат электронной почты',
            })
        }

        const isUser = await User.findOne({ email })

        if (!isUser) {
            return res
                .status(500)
                .json({ message: 'Такой почты не существует' })
        }

        // прежде чем сохранять новые сущности надо старые снести чтобы при след запросе при активации конфликтов не было
        // Удаляем старые записи с тем же email
        await RecoveryPassword.deleteMany({ email })

        // шифрование секретной фразы для одноразовых паролей
        const secret = speakeasy.generateSecret({ length: 20 })

        const recoveryPassword =
            new RecoveryPassword<RecoveryPasswordInterface>({
                email,
                secretKey: secret.base32, // парсинг кода будет по этому ключу в принципе необязательно было его сюда кидать
                status: false,
            })

        // генерация строки для подтверждения сменя пароля
        const code = speakeasy.totp({
            secret: recoveryPassword.secretKey,
            encoding: 'base32',
        })

        await recoveryPassword.save()

        // Отправляем письмо для подтверждения регистрации
        const message = `<p>Пожалуйста кликните по ссылке и смените ваш текущий пароль
                    <a href="${domainFrontend}:${portFrontend}/passwordRecovery/${recoveryPassword._id}-${code}">перейти на страницу смены пароля</a>
                </p>
                <p>
                    Внимание, если это не вы генерировали смену пароля, то не переходите по ссылке
                </p>
               `
        await sendOnEmail(email, message)

        res.json({
            message: `Пожалуйста пройдите на вашу электронную почту и кликните по ссылке чтобы сменить пароль (не забудьте проверить папку спам, письмо от ${emailFrom})`,
        })
    } catch (err) {
        const message = (err as Error).message
        console.error(message) // изменение здесь
        res.status(500).send(`Server Error: ${message}`)
    }
})

export default recoveryPasswordRouter
