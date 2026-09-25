import { Ban, PlusCircle } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "../ui/button";

interface iAppProps {
  title: string;
  description: string;
  buttonText: string;
  href: string;
}

export function EmptyState({
  buttonText,
  description,
  title,
  href,
}: iAppProps) {
  return (
    <div className="flex h-full flex-1 flex-col items-center justify-center rounded-xl border border-dashed bg-card/60 p-10 text-center animate-in fade-in-50">
      <div className="flex size-16 items-center justify-center rounded-2xl bg-brand-soft">
        <Ban className="size-8 text-primary" />
      </div>
      <h2 className="mt-5 font-serif text-xl font-medium">{title}</h2>
      <p className="mt-2 mb-7 max-w-sm text-center text-sm leading-relaxed text-muted-foreground">
        {description}
      </p>
      <Link href={href} className={buttonVariants()}>
        <PlusCircle className="size-4" />
        {buttonText}
      </Link>
    </div>
  );
}
