import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { ModeSwitcher } from "@/components/mode-switcher"
import { useFinance } from "@/context/FinanceContext"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { IconShieldCheck, IconEye } from "@tabler/icons-react"

export function SiteHeader() {
  const { role, setRole } = useFinance()

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 overflow-hidden border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full min-w-0 items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1 shrink-0" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <h1 className="truncate text-base font-medium">Debanjan's Dashboard</h1>
        <div className="ml-auto flex items-center gap-3">
          {/* Role Switcher */}
          <div className="flex items-center gap-2">
            <Badge
              variant={role === "admin" ? "default" : "secondary"}
              className="hidden sm:flex items-center gap-1"
            >
              {role === "admin" ? (
                <IconShieldCheck className="size-3" />
              ) : (
                <IconEye className="size-3" />
              )}
              {role === "admin" ? "Admin" : "Viewer"}
            </Badge>
            <Select value={role} onValueChange={setRole}>
              <SelectTrigger size="sm" className="w-28" id="role-switcher">
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent align="end">
                <SelectItem value="admin">
                  <div className="flex items-center gap-2">
                    <IconShieldCheck className="size-3.5" />
                    Admin
                  </div>
                </SelectItem>
                <SelectItem value="viewer">
                  <div className="flex items-center gap-2">
                    <IconEye className="size-3.5" />
                    Viewer
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <ModeSwitcher />
        </div>
      </div>
    </header>
  )
}
