/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useConfetti } from "@/hooks/use-confetti";
import { ArrowRight, CheckIcon } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

export default function PaymentSuccessfull() {
  const { triggerConfetti } = useConfetti();

  useEffect(() => {
    triggerConfetti();
  }, []);
  return (
    <div className="flex min-h-screen w-full flex-1 items-center justify-center bg-background px-4">
      <Card className="w-full max-w-[400px] gap-0 p-9">
        <CardContent className="flex flex-col items-center gap-3.5 p-0 text-center">
          <span className="flex size-[72px] items-center justify-center rounded-full bg-success-soft text-success">
            <CheckIcon className="size-9" strokeWidth={2} aria-hidden="true" />
          </span>
          <h1 className="mt-1.5 font-serif text-3xl font-medium">Payment Successful</h1>
          <p className="max-w-[300px] text-balance text-[14.5px] leading-relaxed text-muted-foreground">
            Congrats, your payment was successful. You should now have access to the course!
          </p>

          <Link
            href="/dashboard"
            className={buttonVariants({ size: "lg", className: "mt-2.5 w-full" })}
          >
            <ArrowRight className="size-4" />
            Go to Dashboard
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
