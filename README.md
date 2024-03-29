### Локальный запуск проекта

Требования версия Node JS

```v20.9.0```

#### Примерная настройка .env файла

```
PORT=[порт на котором будет работать ваш сервер]

DOMAIN=[домен вашего сервера]

MONGO_DB_PATH=[путь подключения вашей БД]

MONGO_DB_DATABASE=[имя созданной Вами БД]

YANDEX_DISK_OAUTH_TOKEN=[токен для сохранения файлов на яндекс диске]

SERVICE_NODEMAILER=[почтовый сервис через который будет отпр подтверждение авторизации]

LOGIN_NODEMAILER=[логин почты отправителя]

PASSWORD_NODEMAILER=[пароль почты отправителя]

JWT_SECRET_KEY=[секретноге слово для кодировки JWT]
```

Для запуска на локальной машине

1. Прописываем ```.env``` с настройками
2. Старт локального сервера монги ``brew services start mongodb-community``
3. Остановка локального сервера монги после завершения работа ``brew services stop mongodb-community ``
4. Проверка запущен ли сервер монги ``brew services list``
5. Выполняем в терминале ```npm install``` 
6. Выполняем в терминале ```npm run start```



Для deploy берем содержимое папки ```dist```
Предварительно выполнив

```npm run build:production```

#### swagger-api path

``api-docs/``
