import { type Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

import Branding from "@/components/layouts/Branding";
import { Icons } from "@/components/layouts/icons";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { getPageMetadata, siteConfig } from "@/config/site";
import { SignupForm } from "@/features/auth";

export default function SignUpPage() {
  return (
    <section className="w-full max-w-md">
      <Card className="border-0 border-t-4 border-accent">
        <CardHeader className="space-y-6 text-center">
          <div className="flex flex-col items-center space-y-4">
            <Branding className="mb-2" />
            <h1 className="text-3xl font-bold text-primary">Create Account</h1>
            <p className="text-sm text-muted-foreground">
              Sign up to start your{" "}
              <span className="text-primary font-medium">journey</span>
            </p>
          </div>
        </CardHeader>
        <CardContent className="grid gap-4">
          <Suspense
            fallback={
              <div className="bg-zinc-400 animate-pulse max-w-xl w-full h-[360px]" />
            }
          >
            <SignupForm />
          </Suspense>

          {/* TODO: Add OAuth login buttons */}
          {/* <div className="relative my-6">
            <div className="relative flex justify-center text-xs uppercase">
              <div className="absolute inset-0 flex items-center z-0">
                <span className="w-full border-t" />
              </div>
              <span className="bg-background px-2 text-muted-foreground z-10">
                OR
              </span>
            </div>

            <div className="w-full pt-5">
              <OAuthLoginButtons />
            </div>
          </div> */}
        </CardContent>

        <CardFooter className="flex flex-col space-y-4">
          <div className="text-sm text-muted-foreground text-center">
            Already have an account?{" "}
            <Link
              aria-label="Sign in"
              href="/sign-in"
              className="text-primary underline-offset-4 transition-colors hover:underline"
            >
              Sign in here
            </Link>
          </div>
          <Link
            href="/"
            className="flex items-center justify-center text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <Icons.chevronLeft className="h-4 w-4 mr-1" />
            Back to home
          </Link>
        </CardFooter>
      </Card>
    </section>
  );
}
