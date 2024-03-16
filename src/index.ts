import express from 'express'
import swaggerUi from 'swagger-ui-express'
import specs from '@src/swagger-config'
import authRouter from '@src/routes/auth'
import apiRouter from '@src/routes/api'
import cookieParser from 'cookie-parser'

import dotenv from 'dotenv'
import process from 'process'
import { startMongo } from '@src/bd_settings'
import path from 'path'

// Загрузка переменных окружения из файла .env
dotenv.config()

const app = express()
const domain = process.env.DOMAIN || 'http://localhost'
const port = process.env.PORT || 3050

app.use(express.json()) // работа с json
app.use(cookieParser()) // работа с cookie
// указываем папку со статическими файлами
app.use(express.static(path.join(__dirname, 'src', 'static')))

// подключение роутов
app.use('/auth', authRouter)
app.use('/api', apiRouter)

// подключение сваггер справочника по запросам
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs))

// старт сервера поэтапно после запуска БД
async function startServer(): Promise<void> {
    // запуск подключения к БД
    await startMongo()
    // запуск express
    app.listen(port, () => console.log(`Server start на ${domain}:${port}`))
}

// запуск сервера
;(async () => {
    await startServer()
})()
