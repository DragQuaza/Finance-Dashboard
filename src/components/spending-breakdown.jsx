import * as React from "react"
import { Pie, PieChart, Cell, Bar, BarChart, XAxis, YAxis } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { useFinance } from "@/context/FinanceContext"
import { formatCurrency } from "@/lib/utils"

const COLORS = [
  "oklch(0.65 0.24 16.4)",    // red-ish
  "oklch(0.72 0.19 154.7)",   // green
  "oklch(0.65 0.22 255)",     // blue
  "oklch(0.80 0.18 84.4)",    // yellow
  "oklch(0.65 0.26 303.9)",   // purple
  "oklch(0.70 0.17 40)",      // orange  
  "oklch(0.60 0.12 184.7)",   // teal
  "oklch(0.75 0.15 60)",      // warm
  "oklch(0.55 0.15 270)",     // indigo
]

export function SpendingBreakdown() {
  const { categoryBreakdown } = useFinance()

  const data = React.useMemo(() => {
    return Object.entries(categoryBreakdown)
      .map(([name, value], i) => ({
        name,
        value: Math.round(value * 100) / 100,
        fill: COLORS[i % COLORS.length],
      }))
      .sort((a, b) => b.value - a.value)
  }, [categoryBreakdown])

  const chartConfig = React.useMemo(() => {
    const config = {}
    data.forEach((item) => {
      config[item.name] = {
        label: item.name,
        color: item.fill,
      }
    })
    return config
  }, [data])

  const totalSpending = data.reduce((sum, d) => sum + d.value, 0)

  if (!data.length) {
    return (
      <Card className="@container/card">
        <CardHeader>
          <CardTitle>Spending Breakdown</CardTitle>
          <CardDescription>No expense data available</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-[250px]">
          <p className="text-muted-foreground">Add expenses to see breakdown</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Spending Breakdown</CardTitle>
        <CardDescription>Expenses by category</CardDescription>
      </CardHeader>
      <CardContent className="px-2 pt-0">
        <ChartContainer config={chartConfig} className="mx-auto aspect-square h-[250px]">
          <PieChart>
            <ChartTooltip
              content={
                <ChartTooltipContent
                  formatter={(value, name) => [formatCurrency(value), name]}
                />
              }
            />
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              strokeWidth={2}
              stroke="var(--background)"
            >
              {data.map((entry, index) => (
                <Cell key={entry.name} fill={entry.fill} />
              ))}
            </Pie>
          </PieChart>
        </ChartContainer>
        {/* Legend */}
        <div className="mt-4 grid grid-cols-2 gap-2 px-4">
          {data.slice(0, 6).map((item) => (
            <div key={item.name} className="flex items-center gap-2 text-sm">
              <div
                className="size-3 shrink-0 rounded-full"
                style={{ backgroundColor: item.fill }}
              />
              <span className="truncate text-muted-foreground">{item.name}</span>
              <span className="ml-auto font-medium tabular-nums">
                {((item.value / totalSpending) * 100).toFixed(0)}%
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
