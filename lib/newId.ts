// Works in browser and in Node during SSR/build
export function newId(): string {
  // Browser (iPad Safari, Chrome, etc.)
  const g: any = globalThis as any
  if (g.crypto && typeof g.crypto.randomUUID === 'function') {
    return g.crypto.randomUUID()
  }
  // Node (SSR / API routes)
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { randomUUID } = require('crypto')
    return randomUUID()
  } catch {
    // Last-resort fallback
    return Math.random().toString(36).slice(2) + Date.now().toString(36)
  }
}
