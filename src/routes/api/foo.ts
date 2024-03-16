import express from 'express'
import { Request, Response } from 'express'

const fooRouter = express.Router()

fooRouter.get('/', (req: Request, res: Response) => {
    res.send('foo')
})

export default fooRouter
