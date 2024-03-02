import express from 'express';
import { Request, Response } from 'express';
import dotenv from 'dotenv';
import * as process from "process";
import { startMongo } from "@src/bd_settings";

// Загрузка переменных окружения из файла .env
dotenv.config();

const app = express();
const domain = process.env.DOMAIN || 'http://localhost'
const port = process.env.PORT || 3050;

app.get('/', (req: Request, res: Response) => {
    res.send('Hello world!');
});

// старт сервера поэтапно после запуска БД
async function startServer():Promise<any> {
    // запуск подключения к БД
    await startMongo()
    // запуск express
    app.listen(port, () => console.log(`Server start на ${domain}:${port}`));
}

// запуск сервера
(async () => {
    await startServer()
})()
