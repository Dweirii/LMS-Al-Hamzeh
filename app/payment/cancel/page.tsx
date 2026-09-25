import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, XIcon } from "lucide-react";
import Link from "next/link";

export default function PaymentCancelled() {
  return (
    <div className="flex min-h-screen w-full flex-1 items-center justify-center bg-background px-4">
      <Card className="w-full max-w-[400px] gap-0 p-9">
        <CardContent className="flex flex-col items-center gap-3.5 p-0 text-center">
          <span className="flex size-[72px] items-center justify-center rounded-full bg-danger-soft text-danger">
            <XIcon className="size-9" strokeWidth={2} aria-hidden="true" />
          </span>
          <h1 className="mt-1.5 font-serif text-3xl font-medium">Payment Cancelled</h1>
          <p className="max-w-[300px] text-balance text-[14.5px] leading-relaxed text-muted-foreground">
            No worries, you won&apos;t be charged. Please try again!
          </p>

          <Link
            href="/"
            className={buttonVariants({ size: "lg", className: "mt-2.5 w-full" })}
          >
            <ArrowLeft className="size-4" />
            Go back to Homepage
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
