"use client";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="relative min-h-screen">
      <main className="flex min-h-screen items-center justify-center">
        {children}
      </main>
    </div>
  );
}
