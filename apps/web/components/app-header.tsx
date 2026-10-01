"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@workspace/ui/components/breadcrumb"
import { Separator } from "@workspace/ui/components/separator"
import { SidebarTrigger } from "@workspace/ui/components/sidebar"

import { navItems } from "@/components/app-sidebar"
import { LocaleSwitch } from "@/components/locale-switch"
import { ThemeToggle } from "@/components/theme-toggle"
import { getCandidate, getGuide, getJob, getWorkflow } from "@/lib/mock"

const staticLabels: Record<string, string> = {
  new: "New",
  candidates: "Candidates",
  workflow: "Workflow",
  history: "History",
  settings: "Settings",
}

function segmentLabel(segment: string) {
  const nav = navItems.find((item) => item.href === `/${segment}`)
  if (nav) return nav.label

  return (
    staticLabels[segment] ??
    getJob(segment)?.title ??
    getWorkflow(segment)?.name ??
    getGuide(segment)?.name ??
    getCandidate(segment)?.name ??
    segment
  )
}

export function AppHeader() {
  const pathname = usePathname()
  const segments = pathname.split("/").filter(Boolean)

  return (
    <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
      <Breadcrumb>
        <BreadcrumbList>
          {segments.map((segment, i) => {
            const href = `/${segments.slice(0, i + 1).join("/")}`
            const last = i === segments.length - 1

            return (
              <React.Fragment key={href}>
                {i > 0 && <BreadcrumbSeparator />}
                <BreadcrumbItem>
                  {last ? (
                    <BreadcrumbPage>{segmentLabel(segment)}</BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink render={<Link href={href} />}>
                      {segmentLabel(segment)}
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
              </React.Fragment>
            )
          })}
        </BreadcrumbList>
      </Breadcrumb>
      <div className="ml-auto flex items-center gap-1">
        <LocaleSwitch />
        <ThemeToggle />
      </div>
    </header>
  )
}
