import { AuthForm } from "@/components/auth/auth-form";

interface LoginPageProps {
  searchParams?: {
    redirectTo?: string;
  };
}

export default function LoginPage({ searchParams }: LoginPageProps) {
  return <AuthForm mode="login" redirectTo={searchParams?.redirectTo} />;
}
