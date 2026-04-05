import {
  IconTrendingUp,
  IconBulb,
  IconAlertTriangle,
  IconChartPie,
} from "@tabler/icons-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useFinance } from "@/context/FinanceContext"
import { formatCurrency } from "@/lib/utils"

export function InsightsSection() {
  const {
    highestCategory,
    totalIncome,
    totalExpenses,
    transactions,
  } = useFinance()

  const recentTransactions = transactions.filter((t) => {
    const days = (Date.now() - new Date(t.date).getTime()) / (1000 * 60 * 60 * 24)
    return days <= 7
  })

  const weeklySpend = recentTransactions
    .filter((t) => t.type === "expense")
    .reduce((s, t) => s + t.amount, 0)

  const insights = [
    {
      icon: IconChartPie,
      title: "Highest Spending Category",
      value: highestCategory ? highestCategory[0] : "N/A",
      detail: highestCategory ? formatCurrency(highestCategory[1]) : "",
      color: "text-red-500",
      bgColor: "bg-red-500/10",
    },

    {
      icon: IconBulb,
      title: "Weekly Spending",
      value: formatCurrency(weeklySpend),
      detail: `${recentTransactions.filter((t) => t.type === "expense").length} expenses in the last 7 days`,
      color: "text-amber-500",
      bgColor: "bg-amber-500/10",
    },
    {
      icon: totalIncome > totalExpenses ? IconTrendingUp : IconAlertTriangle,
      title: "Financial Health",
      value: totalIncome > totalExpenses * 1.2 ? "Strong" : totalIncome > totalExpenses ? "Good" : "Needs Attention",
      detail: `You're saving ${((1 - totalExpenses / totalIncome) * 100).toFixed(1)}% of your income`,
      color: totalIncome > totalExpenses ? "text-emerald-500" : "text-red-500",
      bgColor: totalIncome > totalExpenses ? "bg-emerald-500/10" : "bg-red-500/10",
    },
  ]

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <IconBulb className="size-5" />
          Financial Insights
        </CardTitle>
        <CardDescription>Key observations from your spending data</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {insights.map((insight) => (
            <div
              key={insight.title}
              className="flex flex-col gap-2 rounded-lg border p-4 transition-colors hover:bg-muted/50"
            >
              <div className="flex items-center gap-2">
                <div className={`rounded-md p-1.5 ${insight.bgColor}`}>
                  <insight.icon className={`size-4 ${insight.color}`} />
                </div>
                <span className="text-sm font-medium text-muted-foreground">
                  {insight.title}
                </span>
              </div>
              <div className={`text-xl font-bold ${insight.color}`}>
                {insight.value}
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {insight.detail}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
