import { IconTrendingDown, IconTrendingUp, IconWallet, IconArrowUpRight, IconArrowDownRight, IconPigMoney } from "@tabler/icons-react"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useFinance } from "@/context/FinanceContext"
import { formatCurrency } from "@/lib/utils"

export function SectionCards() {
  const { totalBalance, totalIncome, totalExpenses, savingsRate, monthlyChange } = useFinance()

  const isSpendingUp = monthlyChange > 0
  const savingsIsPositive = savingsRate > 0

  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      {/* Total Balance */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription className="flex items-center gap-1 truncate">
            <IconWallet className="size-4 shrink-0" />
            <span className="truncate">Total Balance</span>
          </CardDescription>
          <CardTitle className="text-xl font-semibold tabular-nums @[250px]/card:text-2xl min-w-0">
            {formatCurrency(totalBalance)}
          </CardTitle>
          <CardAction>
            <Badge variant="outline" className="whitespace-nowrap">
              {totalBalance >= 0 ? <IconTrendingUp className="shrink-0" /> : <IconTrendingDown className="shrink-0" />}
              {totalBalance >= 0 ? "Positive" : "Negative"}
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex items-center gap-2 font-medium">
            <span className="truncate">Net across all transactions</span>
            {totalBalance >= 0 ? (
              <IconTrendingUp className="size-4 shrink-0 text-emerald-500" />
            ) : (
              <IconTrendingDown className="size-4 shrink-0 text-red-500" />
            )}
          </div>
          <div className="text-muted-foreground truncate">Income minus expenses</div>
        </CardFooter>
      </Card>

      {/* Total Income */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription className="flex items-center gap-1 truncate">
            <IconArrowUpRight className="size-4 shrink-0 text-emerald-500" />
            <span className="truncate">Total Income</span>
          </CardDescription>
          <CardTitle className="text-xl font-semibold tabular-nums @[250px]/card:text-2xl text-emerald-600 dark:text-emerald-400 min-w-0">
            {formatCurrency(totalIncome)}
          </CardTitle>
          <CardAction>
            <Badge variant="outline" className="text-emerald-600 dark:text-emerald-400 whitespace-nowrap">
              <IconTrendingUp className="shrink-0" />
              Income
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex items-center gap-2 font-medium">
            <span className="truncate">All income streams</span>
            <IconTrendingUp className="size-4 shrink-0 text-emerald-500" />
          </div>
          <div className="text-muted-foreground truncate">Salary, freelance, investments</div>
        </CardFooter>
      </Card>

      {/* Total Expenses */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription className="flex items-center gap-1 truncate">
            <IconArrowDownRight className="size-4 shrink-0 text-red-500" />
            <span className="truncate">Total Expenses</span>
          </CardDescription>
          <CardTitle className="text-xl font-semibold tabular-nums @[250px]/card:text-2xl text-red-600 dark:text-red-400 min-w-0">
            {formatCurrency(totalExpenses)}
          </CardTitle>
          <CardAction>
            <Badge variant="outline" className="text-red-600 dark:text-red-400 whitespace-nowrap">
              {isSpendingUp ? <IconTrendingUp className="shrink-0" /> : <IconTrendingDown className="shrink-0" />}
              {isSpendingUp ? `+${monthlyChange.toFixed(1)}%` : `${monthlyChange.toFixed(1)}%`}
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex items-center gap-2 font-medium">
            <span className="truncate">{isSpendingUp ? "Spending up vs last month" : "Spending down vs last month"}</span>
            {isSpendingUp ? (
              <IconTrendingUp className="size-4 shrink-0 text-red-500" />
            ) : (
              <IconTrendingDown className="size-4 shrink-0 text-emerald-500" />
            )}
          </div>
          <div className="text-muted-foreground truncate">Month-over-month comparison</div>
        </CardFooter>
      </Card>

      {/* Savings Rate */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription className="flex items-center gap-1 truncate">
            <IconPigMoney className="size-4 shrink-0" />
            <span className="truncate">Savings Rate</span>
          </CardDescription>
          <CardTitle className="text-xl font-semibold tabular-nums @[250px]/card:text-2xl min-w-0">
            {savingsRate.toFixed(1)}%
          </CardTitle>
          <CardAction>
            <Badge variant="outline" className="whitespace-nowrap">
              {savingsIsPositive ? <IconTrendingUp className="shrink-0" /> : <IconTrendingDown className="shrink-0" />}
              {savingsIsPositive ? "Healthy" : "Needs work"}
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex items-center gap-2 font-medium">
            <span className="truncate">{savingsRate >= 20 ? "Excellent savings habit" : savingsRate >= 10 ? "Good savings rate" : "Consider reducing expenses"}</span>
            {savingsIsPositive ? (
              <IconTrendingUp className="size-4 shrink-0 text-emerald-500" />
            ) : (
              <IconTrendingDown className="size-4 shrink-0 text-red-500" />
            )}
          </div>
          <div className="text-muted-foreground truncate">Percentage of income saved</div>
        </CardFooter>
      </Card>
    </div>
  )
}
