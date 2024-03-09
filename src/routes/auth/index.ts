import express from 'express'
import registerRouter from '@src/routes/auth/registration'
import confirmRouter from '@src/routes/auth/confirm'
import loginRouter from '@src/routes/auth/login'

const authRouter = express.Router()

// импорт и подключение функций авторизации
authRouter.use('/registration', registerRouter)
authRouter.use('/confirm', confirmRouter)
authRouter.use('/login', loginRouter)

export default authRouter
