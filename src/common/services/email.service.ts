import { Resend } from 'resend'
import dotenv from 'dotenv'
dotenv.config({ quiet: true })

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendVerificationCode(recipients: string | string[], val: any) {
  return await resend.emails.send({
    from: `TWDS Auth<${process.env.RESEND_EMAIL}>`,
    to: recipients,
    subject: 'Verification Code',
    html: `<p>your code is: ${val}</p>`
  })
}
