import { AppSidebar } from "@/components/app-sidebar"
import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { DataTable } from "@/components/data-table"
import { SectionCards } from "@/components/section-cards"
import { SpendingBreakdown } from "@/components/spending-breakdown"
import { InsightsSection } from "@/components/insights-section"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"

export default function Dashboard() {
  return (
    <SidebarProvider
      style={{
        "--sidebar-width": "calc(var(--spacing) * 72)",
        "--header-height": "calc(var(--spacing) * 12)",
      }}
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col min-w-0">
          <div className="@container/main flex flex-1 flex-col gap-2 min-w-0">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              {/* Summary Cards */}
              <SectionCards />

              {/* Charts Row */}
              <div className="grid grid-cols-1 gap-4 px-4 lg:grid-cols-3 lg:px-6">
                <div className="lg:col-span-2">
                  <ChartAreaInteractive />
                </div>
                <div className="lg:col-span-1">
                  <SpendingBreakdown />
                </div>
              </div>

              {/* Insights */}
              <div className="px-4 lg:px-6">
                <InsightsSection />
              </div>

              {/* Transactions Table */}
              <DataTable />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
