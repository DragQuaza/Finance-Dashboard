import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import { ThemeProvider } from "@/components/providers/theme-provider"
import { ActiveThemeProvider } from "@/components/active-theme"
import { FinanceProvider } from "@/context/FinanceContext"
import { Toaster } from "@/components/ui/sonner"
import Dashboard from "@/pages/Dashboard"

function getCookie(name) {
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"))
  return match ? match[2] : undefined
}

export default function App() {
  const [activeThemeValue, setActiveThemeValue] = useState(undefined)

  useEffect(() => {
    const cookieTheme = getCookie("active_theme")
    setActiveThemeValue(cookieTheme)
  }, [])

  const isScaled = activeThemeValue?.endsWith("-scaled")

  useEffect(() => {
    document.body.className = cn(
      "bg-background overscroll-none font-sans antialiased",
      activeThemeValue ? `theme-${activeThemeValue}` : "",
      isScaled ? "theme-scaled" : ""
    )
  }, [activeThemeValue, isScaled])

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange
      enableColorScheme
    >
      <ActiveThemeProvider initialTheme={activeThemeValue}>
        <FinanceProvider>
          <Dashboard />
          <Toaster />
        </FinanceProvider>
      </ActiveThemeProvider>
    </ThemeProvider>
  )
}
