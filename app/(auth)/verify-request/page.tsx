"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { authClient } from "@/lib/auth-client";
import { Loader2, Mail } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState, useTransition } from "react";
import { toast } from "sonner";

export default function VerifyRequestRoute() {
  return (
    <Suspense>
      <VerifyRequest />
    </Suspense>
  );
}

function VerifyRequest() {
  const router = useRouter();
  const [otp, setOtp] = useState("");
  const [emailPending, startTranstion] = useTransition();
  const params = useSearchParams();
  const email = params.get("email") as string;
  const isOtpCompleted = otp.length === 6;

  function verifyOtp() {
    startTranstion(async () => {
      await authClient.signIn.emailOtp({
        email: email,
        otp: otp,
        fetchOptions: {
          onSuccess: () => {
            toast.success("Email verified");
            router.push("/");
          },
          onError: () => {
            toast.error("Error verifying Email/OTP");
          },
        },
      });
    });
  }
  return (
    <Card className="mx-auto w-full gap-6 border-0 bg-transparent py-0 shadow-none">
      <CardHeader className="gap-3 px-0">
        <span className="flex size-[52px] items-center justify-center rounded-2xl bg-brand-soft text-primary">
          <Mail className="size-6" aria-hidden="true" />
        </span>
        <CardTitle className="font-serif text-4xl font-medium leading-tight tracking-tight">
          Please check your email
        </CardTitle>
        <CardDescription className="text-[15px] leading-relaxed">
          We have sent a verification email code to your email address. Please
          open the email and paste the code below.
        </CardDescription>
        {email && (
          <span className="inline-flex h-6 w-fit items-center gap-1.5 rounded-full bg-secondary px-2.5 text-xs font-medium text-secondary-foreground">
            <Mail className="size-3.5" aria-hidden="true" />
            {email}
          </span>
        )}
      </CardHeader>
      <CardContent className="space-y-6 px-0">
        <div className="flex flex-col items-start space-y-2.5">
          <InputOTP
            value={otp}
            onChange={(value) => setOtp(value)}
            maxLength={6}
            containerClassName="gap-3"
          >
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
            </InputOTPGroup>
            <InputOTPGroup>
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
          <p className="text-[13px] text-muted-foreground">
            Enter the 6-digit code sent to your email
          </p>
        </div>

        <Button
          onClick={verifyOtp}
          disabled={emailPending || !isOtpCompleted}
          size="lg"
          className="w-full"
        >
          {emailPending ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              <span>Loading...</span>
            </>
          ) : (
            "Verify Account"
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
