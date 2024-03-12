import express from 'express'
import { Request, Response } from 'express'
import { User, Session } from '@src/models/auth'
import jwt from 'jsonwebtoken'

const userInfoRouter = express.Router()

import dotenv from 'dotenv'
import process from 'process'

// Загрузка переменных окружения из файла .env
dotenv.config()

export default userInfoRouter
