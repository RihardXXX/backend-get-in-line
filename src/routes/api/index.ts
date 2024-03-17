import express, { NextFunction, Request, Response } from 'express'
import fooRouter from '@src/routes/api/foo'
import { isUserByToken } from '@src/utils/isUserByToken'
import { IUser, User } from '@src/models/auth'

const apiRouter = express.Router()

// импорт и подключение функций апи
// промежуточное ПО, допуск для авторизованных пользователей
apiRouter.use(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.token
    try {
        // получаем айди пользователя с кук
        const userId = await isUserByToken(token)

        if (!userId) {
            return next('router')
        }

        // находим пользователя по айди его
        const user = await User.findOne<IUser | undefined>({ _id: userId })

        if (!user) {
            return next('router')
        }

        // Если в методе logout мы не будем сносить сессию один раз авторизованного
        // а будем тупо проверять на статус и токен то лучше тут добавить проверку
        // на статус и токен

        next()
    } catch (e) {
        console.log((e as Error).message)
    }
})

apiRouter.use('/foo', fooRouter)

export default apiRouter
