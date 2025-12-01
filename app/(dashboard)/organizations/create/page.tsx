import { CreateOrgForm } from '@/components/organizations/create-org-form'
import { SignOutButton } from '@/components/auth/sign-out-button'

export default function CreateOrgPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="flex justify-end mb-4">
          <SignOutButton />
        </div>
        <CreateOrgForm />
      </div>
    </div>
  )
}