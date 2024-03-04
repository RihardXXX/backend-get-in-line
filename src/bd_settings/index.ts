import mongoose from 'mongoose'
import { Mongoose } from 'mongoose'
import dotenv from 'dotenv'
import * as process from 'process'
// Загрузка переменных окружения из файла .env
dotenv.config()

const mongo_db_path = process.env.MONGO_DB_PATH
const mongo_db_database = process.env.MONGO_DB_DATABASE

export async function startMongo(): Promise<Mongoose> {
    try {
        const connection = await mongoose.connect(
            `${mongo_db_path}/${mongo_db_database}`,
        )
        console.log('MongoDB connected')
        return connection
    } catch (e) {
        console.error('MongoDB connection error:', e)
        throw e
    }
}
