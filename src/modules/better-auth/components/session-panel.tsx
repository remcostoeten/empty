import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { hasDatabase } from "@/core/env"
import { getSession, getUserCount } from "@/modules/better-auth/api/queries"
import { AuthForms } from "@/modules/better-auth/components/auth-forms"
import { SignOutButton } from "@/modules/better-auth/components/sign-out-button"

function DatabaseMissing() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Live demo needs a database</CardTitle>
        <CardDescription>
          Set DATABASE_URL to a Neon connection string, run pnpm db:migrate, and this panel turns into a working sign-up form backed by the auth_ tables.
        </CardDescription>
      </CardHeader>
    </Card>
  )
}

export async function SessionPanel() {
  if (!hasDatabase()) return <DatabaseMissing />

  const [session, users] = await Promise.all([getSession(), getUserCount()])

  if (!session.ok) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Database unreachable</CardTitle>
          <CardDescription>{session.error}</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  if (session.data) {
    const { user } = session.data
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between gap-3">
            <CardTitle>Signed in</CardTitle>
            <Badge variant="secondary" className="font-mono">
              {user.isAnonymous ? "anonymous" : "email"}
            </Badge>
          </div>
          <CardDescription>Session read on the server through auth.api.getSession.</CardDescription>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 font-mono text-xs">
            <dt className="text-gray-600">id</dt>
            <dd className="truncate">{user.id}</dd>
            <dt className="text-gray-600">email</dt>
            <dd className="truncate">{user.email}</dd>
            <dt className="text-gray-600">name</dt>
            <dd className="truncate">{user.name || "—"}</dd>
            <dt className="text-gray-600">table</dt>
            <dd>auth_user</dd>
          </dl>
        </CardContent>
        <CardFooter className="justify-between">
          <span className="text-xs text-muted-foreground">
            {users.ok ? `${users.data} rows in auth_user` : users.error}
          </span>
          <SignOutButton />
        </CardFooter>
      </Card>
    )
  }

  return <AuthForms userCount={users.ok ? users.data : null} />
}
