import jwt, { JwtPayload } from 'jsonwebtoken'

import dotenv from 'dotenv'
import process from 'process'

// Загрузка переменных окружения из файла .env
dotenv.config()

const jwtSecretKey = process.env.JWT_SECRET_KEY || 'foo'

async function isUserByToken(
    token: string,
): Promise<string | jwt.JwtPayload | undefined> {
    try {
        const decoded = jwt.verify(token, jwtSecretKey) as JwtPayload
        return decoded.userId
    } catch (err) {
        console.log('JWT Verify error:', (err as Error).message)
    }
}

export { isUserByToken }
