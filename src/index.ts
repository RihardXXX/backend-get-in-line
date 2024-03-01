import express from 'express';
import { Request, Response } from 'express';
import dotenv from 'dotenv';

import { greeting } from '@src/utils';

console.log(112, greeting);

// Загрузка переменных окружения из файла .env
dotenv.config();

const app = express();
const port = process.env.PORT || 3050;

app.get('/', (req: Request, res: Response) => {
    res.send('Hello world!');
});

app.listen(port, () => {
    console.log(`Server start на http://localhost:${port}`);
});
