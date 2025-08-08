import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function SetupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Complete Your Profile</CardTitle>
          <CardDescription>
            Please complete your profile setup to continue
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Your profile information is incomplete. Please update your profile to access the dashboard.
            </p>
            <Link href="/dashboard/settings">
              <Button className="w-full">
                Complete Profile
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
