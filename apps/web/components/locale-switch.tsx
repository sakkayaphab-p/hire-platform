"use client"

import * as React from "react"

import { Button } from "@workspace/ui/components/button"

// Placeholder: the mock is English-only. This only remembers the choice locally.
export function LocaleSwitch() {
  const [locale, setLocale] = React.useState<"EN" | "TH">("EN")

  return (
    <Button
      variant="ghost"
      size="sm"
      aria-label="Switch language"
      onClick={() => setLocale(locale === "EN" ? "TH" : "EN")}
    >
      {locale}
    </Button>
  )
}
