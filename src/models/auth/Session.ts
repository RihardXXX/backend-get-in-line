// тут будут хранится конкретные данные об авторизации пользователя
// 1. айди аккаунта основного
// 2. статус авторизации
// 3. кодированный токен
import { Schema, model } from 'mongoose'

export interface ISession {
    userID: string
    status: string | 'authorized'
    tokenAuth: string
}

const sessionSchema = new Schema<ISession>({
    userID: { type: String, required: true },
    status: { type: String, required: true },
    tokenAuth: { type: String, required: true },
})

export const Session = model<ISession>('Session', sessionSchema)
