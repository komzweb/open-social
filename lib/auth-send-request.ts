import { APP_NAME, SITE_URL } from '@/lib/constants'

type Theme = {
  brandColor?: string
  buttonText?: string
}

export async function authSendRequest({
  apiKey,
  from,
  to,
  url,
}: {
  apiKey: string | undefined
  from: string
  to: string
  url: string
}) {
  const { host } = new URL(url)
  const theme: Theme = {
    brandColor: '#14b8a6',
    buttonText: '#fff',
  }
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from,
      to,
      subject: `Sign in to ${APP_NAME} (${host})`,
      html: html({ url, theme }),
      text: text({ url }),
    }),
  })

  if (!res.ok)
    throw new Error('Resend error: ' + JSON.stringify(await res.json()))
}

function html(params: { url: string; theme: Theme }) {
  const { url, theme } = params

  const brandColor = theme.brandColor || '#111'
  const color = {
    background: '#fff',
    text: '#333',
    mainBackground: '#fff',
    buttonBackground: brandColor,
    buttonBorder: brandColor,
    buttonText: theme.buttonText || '#fff',
  }

  return `
  <body style="background: ${color.background};">
    <table width="100%" border="0" cellspacing="20" cellpadding="0"
      style="background: ${color.mainBackground}; max-width: 600px; margin: auto;">
      <tr>
        <td align="center"
          style="padding: 10px 0px 0px 0px; font-size: 22px; font-family: Helvetica, Arial, sans-serif; color: ${color.text};">
         Sign in to <strong>${APP_NAME}</strong>
        </td>
      </tr>
      <tr>
        <td align="center"
          style="padding: 10px 0px 0px 0px; font-size: 16px; line-height: 22px; font-family: Helvetica, Arial, sans-serif; color: ${color.text};">
          Click the button below to sign in.
        </td>
      </tr>
      <tr>
        <td align="center" style="padding: 30px 0;">
          <table border="0" cellspacing="0" cellpadding="0">
            <tr>
              <td align="center" style="border-radius: 5px;" bgcolor="${color.buttonBackground}">
                <a href="${url}"
                  target="_blank"
                  rel="noopener noreferrer"
                  style="font-size: 16px; font-family: Helvetica, Arial, sans-serif; color: ${color.buttonText}; text-decoration: none; border-radius: 5px; padding: 10px 20px; border: 1px solid ${color.buttonBorder}; display: inline-block; font-weight: bold;">
                  Sign in to ${APP_NAME}
                </a>
              </td>
            </tr>
          </table>
        </td>
      </tr>
      <tr>
        <td align="center"
          style="padding: 0px 0px 10px 0px; font-size: 16px; line-height: 22px; font-family: Helvetica, Arial, sans-serif; color: ${color.text};">
          If you did not request this email, please ignore it.
        </td>
      </tr>
      <tr>
        <td align="center"
          style="padding: 0px 0px 10px 0px; font-size: 16px; line-height: 22px; font-family: Helvetica, Arial, sans-serif; color: ${color.text};">
          If you have any problems, please contact
          <a href="${SITE_URL}/support"
            target="_blank"
            rel="noopener noreferrer"
            style="text-decoration: underline;">
            ${APP_NAME} Support
          </a>
          for help.
        </td>
      </tr>
    </table>
  </body>
  `
}

function text({ url }: { url: string }) {
  return `Sign in to ${APP_NAME}\n${url}\n\n`
}
