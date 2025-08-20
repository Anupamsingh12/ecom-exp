import { SignInForm } from "@/components/auth/signin-form";

export default function SignInPage() {
  return (
    <div className="flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Welcome Back</h1>
          <p className="text-muted-foreground">Sign in to your account</p>
        </div> */}
        <SignInForm />
      </div>
    </div>
  )
}
