"use client";

import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { ChevronDown, Languages } from "lucide-react";
import { startTransition } from "react";
import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";

const languageOptions = [
  { locale: "en", label: "English", flag: "🇬🇧" },
  { locale: "es", label: "Español", flag: "🇪🇸" },
] as const;

export function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const current = languageOptions.find((item) => item.locale === locale) ?? languageOptions[0];

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-body/85 outline-none transition hover:border-cyan/40 hover:text-cyan">
        <Languages className="h-4 w-4" />
        <span>{current.flag}</span>
        <span>{current.label}</span>
        <ChevronDown className="h-4 w-4" />
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          sideOffset={10}
          className="z-[80] min-w-48 rounded-3xl border border-white/10 bg-[#08111e]/95 p-2 shadow-2xl backdrop-blur-xl"
        >
          {languageOptions.map((item) => (
            <DropdownMenu.Item
              key={item.locale}
              onSelect={() =>
                startTransition(() => {
                  router.replace(pathname, { locale: item.locale });
                })
              }
              className="flex cursor-pointer items-center gap-3 rounded-2xl px-3 py-3 text-sm text-body/80 outline-none transition hover:bg-white/5 hover:text-ink"
            >
              <span>{item.flag}</span>
              <span>{item.label}</span>
            </DropdownMenu.Item>
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
