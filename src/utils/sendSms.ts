import * as twilio from 'twilio'

import dotenv from 'dotenv'
import process from 'process'

// Загрузка переменных окружения из файла .env
dotenv.config()

const accountSid = process.env.ACOOUNT_SID_TWILIO
const authToken = process.env.AUTH_TOKEN_TWILIO
const myNumber = process.env.MY_TWILIO_NUMBER

const client: twilio.Twilio = new twilio.Twilio(accountSid, authToken)

console.log('myNumber', myNumber)
export async function sendSMS(phone: string, token: string) {
    try {
        const response = await client.messages.create({
            body: token,
            from: myNumber,
            to: phone,
        })

        console.log('SMS sent successfully:', response.sid)
    } catch (error) {
        console.error('Error sending SMS:', error)
    }
}
