import { Buffer } from 'buffer'

export const getToken = () => {
  return window.localStorage.getItem('token')
}

export const getPayload = () => {
  const token = getToken()
  if (!token) return
  const splitToken = token.split('.')
  if (splitToken.length !== 3) return
  return JSON.parse(Buffer.from(splitToken[1], 'base64'))
}

export const authUser = () => {
  const payload = getPayload()
  if (!payload) return

  const currentTime = Math.round(Date.now() / 1000)
  return currentTime < payload.exp
}
