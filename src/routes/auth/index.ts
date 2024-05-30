import express from 'express'
import registerRouter from '@src/routes/auth/registration'
import confirmRouter from '@src/routes/auth/confirm'
import loginRouter from '@src/routes/auth/login'
import verifyRouter from '@src/routes/auth/verify'
import userInfoRouter from '@src/routes/auth/userInfo'
import logoutRouter from '@src/routes/auth/logout'
import recoveryPasswordRouter from '@src/routes/auth/recoveryPassword'
import changePasswordRouter from '@src/routes/auth/changePassword'
import newPasswordRouter from '@src/routes/auth/newPassword'

const authRouter = express.Router()

// импорт и подключение функций авторизации
authRouter.use('/registration', registerRouter)
authRouter.use('/confirm', confirmRouter)
authRouter.use('/login', loginRouter)
authRouter.use('/verify', verifyRouter)
authRouter.use('/user-info', userInfoRouter)
authRouter.use('/logout', logoutRouter)
authRouter.use('/recovery-password', recoveryPasswordRouter)
authRouter.use('/change-password', changePasswordRouter)
authRouter.use('/new-password', newPasswordRouter)

export default authRouter
