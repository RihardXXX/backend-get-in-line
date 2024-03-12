import { User } from '@src/models/auth'
import qrcode from 'qrcode' // Подключаем библиотеку для генерации QR-кода
import axios from 'axios'
import { urls } from '@src/api/urls'

import dotenv from 'dotenv'
import process from 'process'

// Загрузка переменных окружения из файла .env
dotenv.config()

const OAuthToken = process.env.YANDEX_DISK_OAUTH_TOKEN

// Работа с яндекс диском
// Функция для генерации и сохранения QR-кода
// Метод будет на фронте создавать qrcode картинку и отправлять картинку, далее бэк будет готовый файл сохранять в облако
async function generateAndSaveQRCode(userId: string) {
    const user = await User.findById(userId)

    if (!user) {
        return
    }

    const qrCodeDataUrl = await qrcode.toDataURL(`User ID: ${userId}`) // Получаем URL-адрес данных для QR-кода

    try {
        // Отправляем запрос на загрузку файла на Яндекс.Диск
        const response = await axios.post(
            urls.yandexDiskUrl,
            {
                url: qrCodeDataUrl,
                path: `/qrCodes/${userId}_qr.png`, // Укажите путь на Яндекс.Диске, куда вы хотите загрузить файл
            },
            {
                headers: {
                    Authorization: `OAuth ${OAuthToken}`, // Укажите ваш OAuth токен для доступа к API Яндекс.Диска
                },
            },
        )

        console.log(response)

        // Если загрузка прошла успешно, обновляем документ пользователя с ссылкой на файл на Яндекс.Диске
        if (response.data && response.data.href) {
            user.qrCode = response.data.href // Обновляем документ пользователя с ссылкой на QR-код
            await user.save() // Сохраняем документ пользователя
        } else {
            console.error('Ошибка загрузки файла на Яндекс.Диск')
        }
    } catch (e) {
        console.log(112, e)
        console.log(
            `Ошибка сохранения картинки на яндекс диск: ${(e as Error).message}`,
        )
    }
}

export { generateAndSaveQRCode }
