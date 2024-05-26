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

const changePasswordRouter = express.Router()

/**
 * @swagger
 * /auth/change-password:
 *   post:
 *     summary: Отправка кода для активации режима смены пароля
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
        const recoveryPassword =
            await RecoveryPassword.findOne<RecoveryPasswordInterface>({
                _id,
            })

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

        //
        // const isValidEmail = emailRegex.test(email)
        //
        // if (!isValidEmail) {
        //     return res.status(500).json({
        //         message: 'неверный формат электронной почты',
        //     })
        // }
        //
        // const isUser = await User.findOne({ email })
        //
        // if (!isUser) {
        //     return res
        //         .status(500)
        //         .json({ message: 'Такой почты не существует' })
        // }
        //
        // // генерация строки для подтверждения сменя пароля
        // const code = speakeasy.totp({
        //     secret: email,
        //     encoding: 'base32',
        // })
        //
        // // прежде чем сохранять новые сущности надо старые снести чтобы при след запросе при активации конфликтов не было
        // // Удаляем старые записи с тем же email
        // await RecoveryPassword.deleteMany({ email });
        //
        // const recoveryPassword = new RecoveryPassword<RecoveryPasswordInterface>({
        //     email,
        //     secretKey: email, // парсинг кода будет по этому ключу в принципе необязательно было его сюда кидать
        //     status: false,
        // })
        //
        // await recoveryPassword.save()
        //
        // // Отправляем письмо для подтверждения регистрации
        // const message = `<p>Пожалуйста кликните по ссылке и смените ваш текущий пароль
        //             <a href="${domainFrontend}:${portFrontend}/passwordRecovery/${code}">перейти на страницу смены пароля</a>
        //         </p>
        //         <p>
        //             Внимание, если это не вы генерировали смену пароля, то не переходите по ссылке
        //         </p>
        //        `
        // await sendOnEmail(email, message)

        res.json({
            _id,
            otp,
        })
    } catch (err) {
        const message = (err as Error).message
        console.error(message) // изменение здесь
        res.status(500).send(`Server Error: ${message}`)
    }
})

export default changePasswordRouter
