import { Schema, model } from 'mongoose'

// 1. Create an interface representing a document in MongoDB.
export interface RecoveryPasswordInterface {
    email: string
    secretKey: string
    status: boolean
}

// 2. Create a Schema corresponding to the document interface.
const RecoveryPasswordSchema = new Schema<RecoveryPasswordInterface>({
    email: { type: String, required: true },
    secretKey: { type: String, required: true },
    status: { type: Boolean, required: true },
})

// 3. Create a Model and import
export const RecoveryPassword = model<RecoveryPasswordInterface>(
    'RecoveryPassword',
    RecoveryPasswordSchema,
)
