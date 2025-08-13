// lib/newId.ts
export function newId(): string {
  const g: any = globalThis as any
  if (g.crypto && typeof g.crypto.randomUUID === 'function') {
    return g.crypto.randomUUID()
  }
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { randomUUID } = require('crypto')
    return randomUUID()
  } catch {
    return Math.random().toString(36).slice(2) + Date.now().toString(36)
  }
}
