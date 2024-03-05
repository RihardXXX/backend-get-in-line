import express from 'express'
import swaggerUi from 'swagger-ui-express'
import specs from '@src/swagger-config'
import authRouter from '@src/routes/auth'

import dotenv from 'dotenv'
import process from 'process'
import { startMongo } from '@src/bd_settings'

// Загрузка переменных окружения из файла .env
dotenv.config()

const app = express()
const domain = process.env.DOMAIN || 'http://localhost'
const port = process.env.PORT || 3050

app.use(express.json())

// подключение сваггер справочника по запросам
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs))

// подключение роутов
app.use('/auth', authRouter)

// определение айпи адреса
// app.get('/', (req, res) => {
//     // const ip = req.ip // Получение IP-адреса пользователя из запроса
//     const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
//
//     res.send(ip)
// })

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
