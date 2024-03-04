import express from 'express'
import { Request, Response } from 'express'
const registerRouter = express.Router()

/**
 * @swagger
 * /auth/register:
 *   get:
 *     summary: регистрация пользователя
 *     description: регистрируем нового пользователя
 *     responses:
 *       200:
 *         description: Успешный ответ. Возвращает сообщение о регистрации и токен
 */
registerRouter.get('/', (req: Request, res: Response) => {
    // Здесь можно добавить логику проверки логина и пароля
    // const { username, password } = req.body;

    res.status(200).json({ message: 'register' })

    // Пример проверки просто по демонстрации
    // if (username === 'user' && password === 'password') {
    //     res.status(200).json({ message: 'Вход выполнен успешно' });
    // } else {
    //     res.status(401).json({ message: 'Неверное имя пользователя или пароль' });
    // }
})

export default registerRouter
