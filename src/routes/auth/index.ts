import express from 'express'
import registerRouter from '@src/routes/auth/register'
const authRouter = express.Router()

// импорт и подключение функций авторизации
authRouter.use('/register', registerRouter)

export default authRouter
