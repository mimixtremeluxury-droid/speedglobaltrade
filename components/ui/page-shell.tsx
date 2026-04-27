import { cn } from "@/lib/cn";

export function PageShell({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <section className={cn("mx-auto w-full max-w-6xl px-4 py-11 md:px-6 md:py-14 xl:py-16", className)}>{children}</section>
  );
}
