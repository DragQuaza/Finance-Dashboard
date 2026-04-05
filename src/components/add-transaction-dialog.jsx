import * as React from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useFinance } from "@/context/FinanceContext"
import { incomeCategories, expenseCategories } from "@/data/mockData"
import { generateId } from "@/lib/utils"
import { IconPlus } from "@tabler/icons-react"
import { toast } from "sonner"

export function AddTransactionDialog({ children }) {
  const { addTransaction } = useFinance()
  const [open, setOpen] = React.useState(false)
  const [type, setType] = React.useState("expense")
  const [category, setCategory] = React.useState("")
  const [amount, setAmount] = React.useState("")
  const [description, setDescription] = React.useState("")
  const [date, setDate] = React.useState(new Date().toISOString().substring(0, 10))

  const categories = type === "income" ? incomeCategories : expenseCategories

  const resetForm = () => {
    setType("expense")
    setCategory("")
    setAmount("")
    setDescription("")
    setDate(new Date().toISOString().substring(0, 10))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!amount || !description || !category) {
      toast.error("Please fill in all fields")
      return
    }

    const transaction = {
      id: generateId(),
      date: new Date(date).toISOString(),
      description,
      amount: parseFloat(amount),
      type,
      category,
    }

    addTransaction(transaction)
    toast.success(`${type === "income" ? "Income" : "Expense"} added successfully!`)
    resetForm()
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button size="sm">
            <IconPlus className="size-4" />
            <span className="hidden lg:inline">Add Transaction</span>
            <span className="lg:hidden">Add</span>
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Transaction</DialogTitle>
          <DialogDescription>
            Add a new income or expense transaction.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-2">
          {/* Type */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="tx-type" className="text-right">Type</Label>
            <div className="col-span-3">
              <Select value={type} onValueChange={(v) => { setType(v); setCategory("") }}>
                <SelectTrigger id="tx-type" className="w-full">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="expense">Expense</SelectItem>
                  <SelectItem value="income">Income</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Description */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="tx-desc" className="text-right">Description</Label>
            <Input
              id="tx-desc"
              placeholder="e.g. Coffee Shop"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="col-span-3"
            />
          </div>

          {/* Amount */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="tx-amount" className="text-right">Amount</Label>
            <Input
              id="tx-amount"
              type="number"
              step="0.01"
              min="0.01"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="col-span-3"
            />
          </div>

          {/* Category */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="tx-category" className="text-right">Category</Label>
            <div className="col-span-3">
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger id="tx-category" className="w-full">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Date */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="tx-date" className="text-right">Date</Label>
            <Input
              id="tx-date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="col-span-3"
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Add Transaction</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
