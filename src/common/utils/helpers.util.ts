export function generateRandomCode(length: number = 6): string {
  /** Generate Random */
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let randomCode = ''

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length)
    randomCode += characters.charAt(randomIndex)
  }
  return randomCode
}

export function generateRandomNumbers(length: number = 6): string {
  const digits = Array.from({ length }, () => Math.floor(Math.random() * 10))
  return digits.join('')
}
