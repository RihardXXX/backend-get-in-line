import swaggerJsdoc from 'swagger-jsdoc'

const options = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'My API',
            version: '1.0.0',
            description: 'API для работы с авторизацией и сервисами бэкенда',
        },
    },
    apis: ['./src/routes/*/!(*.spec).ts'], // поиск во всех папках внутри routes файлов с аннотацией
}

const specs = swaggerJsdoc(options)

export default specs
