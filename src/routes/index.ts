import express from 'express'
import authRouter from '@src/routes/auth'
import apiRouter from '@src/routes/api'

const baseRouter = express.Router()

baseRouter.use('/auth', authRouter)
baseRouter.use('/api', apiRouter)

export default baseRouter
