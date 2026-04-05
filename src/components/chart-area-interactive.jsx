import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, Bar, BarChart } from "recharts"
import { useIsMobile } from "@/hooks/use-mobile"
import {
  Card,
  CardAction,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group"
import { useFinance } from "@/context/FinanceContext"
import { formatCurrency } from "@/lib/utils"

const chartConfig = {
  income: {
    label: "Income",
    color: "oklch(0.72 0.19 154.7)",
  },
  expenses: {
    label: "Expenses",
    color: "oklch(0.63 0.24 25.7)",
  },
  balance: {
    label: "Balance",
    color: "var(--primary)",
  },
}

export function ChartAreaInteractive() {
  const isMobile = useIsMobile()
  const { transactions } = useFinance()
  const [timeRange, setTimeRange] = React.useState("90d")

  React.useEffect(() => {
    if (isMobile) {
      setTimeRange("30d")
    }
  }, [isMobile])

  // Build daily balance data from transactions
  const chartData = React.useMemo(() => {
    if (!transactions.length) return []

    const dailyMap = {}
    const now = new Date()
    let daysToShow = 90
    if (timeRange === "30d") daysToShow = 30
    else if (timeRange === "7d") daysToShow = 7

    // Initialize days
    for (let i = daysToShow; i >= 0; i--) {
      const d = new Date(now)
      d.setDate(d.getDate() - i)
      const key = d.toISOString().substring(0, 10)
      dailyMap[key] = { date: key, income: 0, expenses: 0 }
    }

    // Aggregate transactions
    transactions.forEach((t) => {
      const key = new Date(t.date).toISOString().substring(0, 10)
      if (dailyMap[key]) {
        if (t.type === "income") dailyMap[key].income += t.amount
        else dailyMap[key].expenses += t.amount
      }
    })

    // Compute cumulative balance
    let runningBalance = 0
    return Object.values(dailyMap)
      .sort((a, b) => a.date.localeCompare(b.date))
      .map((day) => {
        runningBalance += day.income - day.expenses
        return { ...day, balance: runningBalance }
      })
  }, [transactions, timeRange])

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Balance Trend</CardTitle>
        <CardDescription>
          <span className="hidden @[540px]/card:block">
            Income vs Expenses over time
          </span>
          <span className="@[540px]/card:hidden">Balance flow</span>
        </CardDescription>
        <CardAction>
          <ToggleGroup
            type="single"
            value={timeRange}
            onValueChange={setTimeRange}
            variant="outline"
            className="hidden *:data-[slot=toggle-group-item]:!px-4 @[767px]/card:flex"
          >
            <ToggleGroupItem value="90d">Last 3 months</ToggleGroupItem>
            <ToggleGroupItem value="30d">Last 30 days</ToggleGroupItem>
            <ToggleGroupItem value="7d">Last 7 days</ToggleGroupItem>
          </ToggleGroup>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger
              className="flex w-40 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate @[767px]/card:hidden"
              size="sm"
              aria-label="Select time range"
            >
              <SelectValue placeholder="Last 3 months" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="90d" className="rounded-lg">Last 3 months</SelectItem>
              <SelectItem value="30d" className="rounded-lg">Last 30 days</SelectItem>
              <SelectItem value="7d" className="rounded-lg">Last 7 days</SelectItem>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="fillIncome" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-income)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--color-income)" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="fillExpenses" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-expenses)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--color-expenses)" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value)
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value, payload) => {
                    const rawDate = payload?.[0]?.payload?.date || String(value)
                    const parts = rawDate.split("-")
                    if (parts.length === 3) {
                      const date = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]))
                      return date.toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })
                    }
                    return rawDate
                  }}
                  indicator="dot"
                  formatter={(value, name, item) => (
                    <>
                      <div
                        className="h-2.5 w-2.5 shrink-0 rounded-[2px]"
                        style={{ backgroundColor: item.color }}
                      />
                      <div className="flex flex-1 justify-between items-center gap-4 leading-none">
                        <span className="text-muted-foreground capitalize">{name}</span>
                        <span className="font-mono font-medium tabular-nums text-foreground">
                          {formatCurrency(value)}
                        </span>
                      </div>
                    </>
                  )}
                />
              }
            />
            <Area
              dataKey="income"
              type="monotone"
              fill="url(#fillIncome)"
              stroke="var(--color-income)"
              strokeWidth={2}
            />
            <Area
              dataKey="expenses"
              type="monotone"
              fill="url(#fillExpenses)"
              stroke="var(--color-expenses)"
              strokeWidth={2}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
