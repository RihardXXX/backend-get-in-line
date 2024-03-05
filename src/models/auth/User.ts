import { Schema, model, SchemaDefinitionProperty } from 'mongoose'

// 1. Create an interface representing a document in MongoDB.
export interface IUser {
    name: string
    email: string
    password: string
    avatar?: string
    secret: string
    confirmationCode:
        | SchemaDefinitionProperty<string | 'authorized'>
        | undefined
    qrCode?: string // Добавляем свойство для QR-кода
}

// 2. Create a Schema corresponding to the document interface.
const userSchema = new Schema<IUser>({
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    avatar: String,
    secret: { type: String, required: true },
    confirmationCode: {
        type: Schema.Types.Mixed,
        required: true,
        validate: {
            validator: (value: string | 'authorized'): boolean => {
                return typeof value === 'string' || value === 'authorized'
            },
            message: 'Тип может быть только string or "authorized"',
        },
    },
    qrCode: String, // Определяем свойство для QR-кода
})

// 3. Create a Model and import
export const User = model<IUser>('User', userSchema)
