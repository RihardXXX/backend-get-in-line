import express from 'express'
import registerRouter from '@src/routes/auth/registration'
import confirmRouter from '@src/routes/auth/confirm'
import loginRouter from '@src/routes/auth/login'
import verifyRouter from '@src/routes/auth/verify'
import userInfoRouter from '@src/routes/auth/userInfo'

const authRouter = express.Router()

// импорт и подключение функций авторизации
authRouter.use('/registration', registerRouter)
authRouter.use('/confirm', confirmRouter)
authRouter.use('/login', loginRouter)
authRouter.use('/verify', verifyRouter)
authRouter.use('/user-info', userInfoRouter)

export default authRouter
