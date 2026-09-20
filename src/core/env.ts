export function hasDatabase() {
  return Boolean(process.env.DATABASE_URL)
}

export function hasClerkKeys() {
  return Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && process.env.CLERK_SECRET_KEY)
}
