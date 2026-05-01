"use client";

import { FormEvent, useState } from "react";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";

export function HeroEmailForm({
  placeholder,
  cta,
}: {
  placeholder: string;
  cta: string;
}) {
  const router = useRouter();
  const locale = useLocale();
  const [email, setEmail] = useState("");

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const search = email ? `?email=${encodeURIComponent(email)}` : "";
    router.push(`/${locale}/signup${search}`);
  };

  return (
    <form onSubmit={onSubmit} className="surface-soft flex flex-col gap-3 p-3 sm:flex-row sm:items-center">
      <input
        type="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        placeholder={placeholder}
        className="h-12 flex-1 rounded-full bg-transparent px-4 text-sm text-ink outline-none placeholder:text-body/45"
      />
      <button type="submit" className="gold-button min-w-40">
        {cta}
        <ArrowRight className="ml-2 h-4 w-4" />
      </button>
    </form>
  );
}
