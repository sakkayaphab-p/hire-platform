"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  BriefcaseIcon,
  CaretUpDownIcon,
  ChatsCircleIcon,
  FlowArrowIcon,
  GearSixIcon,
  SignOutIcon,
} from "@phosphor-icons/react"

import {
  Avatar,
  AvatarFallback,
} from "@workspace/ui/components/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@workspace/ui/components/sidebar"

import { currentUser } from "@/lib/mock"

export const navItems = [
  { href: "/jobs", label: "Jobs", icon: BriefcaseIcon },
  { href: "/workflows", label: "Workflows", icon: FlowArrowIcon },
  { href: "/guides", label: "Interview guides", icon: ChatsCircleIcon },
  { href: "/settings", label: "Settings", icon: GearSixIcon },
]

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()
}

export function AppSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" render={<Link href="/jobs" />}>
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-sm font-semibold text-primary-foreground">
                G
              </div>
              <div className="grid flex-1 text-left leading-tight">
                <span className="truncate font-medium">GetLinks Hire</span>
                <span className="truncate text-xs text-muted-foreground">
                  Mock workspace
                </span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Hiring</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map(({ href, label, icon: Icon }) => (
                <SidebarMenuItem key={href}>
                  <SidebarMenuButton
                    isActive={pathname === href || pathname.startsWith(`${href}/`)}
                    tooltip={label}
                    render={<Link href={href} />}
                  >
                    <Icon />
                    <span>{label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger render={<SidebarMenuButton size="lg" />}>
                <Avatar>
                  <AvatarFallback>{initials(currentUser.name)}</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left leading-tight">
                  <span className="truncate font-medium">{currentUser.name}</span>
                  <span className="truncate text-xs text-muted-foreground">
                    {currentUser.email}
                  </span>
                </div>
                <CaretUpDownIcon className="ml-auto" />
              </DropdownMenuTrigger>
              <DropdownMenuContent side="top" align="start" className="min-w-56">
                <DropdownMenuGroup>
                  <DropdownMenuLabel>{currentUser.role}</DropdownMenuLabel>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem render={<Link href="/settings" />}>
                  <GearSixIcon />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuItem render={<Link href="/login" />}>
                  <SignOutIcon />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
