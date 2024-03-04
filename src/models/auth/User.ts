import { Schema, model, SchemaDefinitionProperty } from 'mongoose'

// 1. Create an interface representing a document in MongoDB.
interface IUser {
    name: string
    email: string
    avatar?: string
    secret: string
    confirmationCode:
        | SchemaDefinitionProperty<string | boolean, IUser>
        | undefined
    qrCode?: string // Добавляем свойство для QR-кода
}

// 2. Create a Schema corresponding to the document interface.
const userSchema = new Schema<IUser>({
    name: { type: String, required: true },
    email: { type: String, required: true },
    avatar: String,
    secret: { type: String, required: true },
    confirmationCode: {
        type: Schema.Types.Mixed, // Используйте Mixed для допустимости нескольких типов
        required: true,
        validate: {
            // validator: (value: string | boolean) => typeof value === 'string' || typeof value === 'boolean',
            validator: (value: string | boolean) =>
                ['string', 'boolean'].includes(typeof value),
            message: 'Тип может быть только string or boolean',
        },
    },
    qrCode: String, // Определяем свойство для QR-кода
})

// 3. Create a Model and import
export const User = model<IUser>('User', userSchema)
