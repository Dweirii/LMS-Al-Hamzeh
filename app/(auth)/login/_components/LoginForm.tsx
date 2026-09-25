"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";

import { GithubIcon, Loader, Loader2, Mail, Send } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";

export function LoginForm() {
  const router = useRouter();
  const [githubPending, startGithubTransition] = useTransition();
  const [emailPending, startEmailTransition] = useTransition();
  const [email, setEmail] = useState("");

  async function signInWithGithub() {
    startGithubTransition(async () => {
      await authClient.signIn.social({
        provider: "github",
        callbackURL: "/",
        fetchOptions: {
          onSuccess: () => {
            toast.success("Singed in with Github, you will be redirected...");
          },
          onError: () => {
            toast.error("Internal Server Error");
          },
        },
      });
    });
  }

  function signInWithEmail() {
    startEmailTransition(async () => {
      await authClient.emailOtp.sendVerificationOtp({
        email: email,
        type: "sign-in",
        fetchOptions: {
          onSuccess: () => {
            toast.success("Email sent");
            router.push(`/verify-request?email=${email}`);
          },
          onError: (ctx) => {
            // Show the server's reason (rate limit, blocked email, etc.) when it sends one.
            toast.error(ctx.error.message || "Error sending email");
          },
        },
      });
    });
  }
  return (
    <Card className="gap-6 border-0 bg-transparent py-0 shadow-none">
      <CardHeader className="gap-2 px-0">
        <CardTitle className="font-serif text-4xl font-medium tracking-tight">
          Welcome!
        </CardTitle>
        <CardDescription className="text-[15px]">
          Login with your Github or Email Account
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col gap-5 px-0">
        <Button
          disabled={githubPending}
          onClick={signInWithGithub}
          className="w-full"
          variant="outline"
          size="lg"
        >
          {githubPending ? (
            <>
              <Loader className="size-4 animate-spin" />
              <span>Loading...</span>
            </>
          ) : (
            <>
              <GithubIcon className="size-4" />
              Sign in with GitHub
            </>
          )}
        </Button>

        <div className="flex items-center gap-3 text-[12.5px] text-muted-foreground">
          <span className="h-px flex-1 bg-border" />
          Or continue with
          <span className="h-px flex-1 bg-border" />
        </div>

        <div className="flex flex-col gap-3.5">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail
                className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
              />
            <Input
              id="email"
              className="h-12 pl-10"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="m@example.com"
              required
            />
            </div>
          </div>

          <Button onClick={signInWithEmail} disabled={emailPending} size="lg">
            {emailPending ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                <span>Loading...</span>
              </>
            ) : (
              <>
                <Send className="size-4" />
                <span>Continue with Email</span>
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
