import { User, IUser, Session, ISession } from '@src/models/auth'
import jwt from 'jsonwebtoken'

import dotenv from 'dotenv'
import process from 'process'

// Загрузка переменных окружения из файла .env
dotenv.config()

const jwtSecretKey = process.env.JWT_SECRET_KEY

async function isUserByToken(token: string) {
    console.log('token: ', token)
}

export { isUserByToken }
