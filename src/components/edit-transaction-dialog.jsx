import * as React from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
import { toast } from "sonner"

export function EditTransactionDialog({ transaction, open, onOpenChange }) {
  const { editTransaction } = useFinance()
  const [type, setType] = React.useState(transaction.type)
  const [category, setCategory] = React.useState(transaction.category)
  const [amount, setAmount] = React.useState(String(transaction.amount))
  const [description, setDescription] = React.useState(transaction.description)
  const [date, setDate] = React.useState(
    new Date(transaction.date).toISOString().substring(0, 10)
  )

  // Sync form when a different transaction is opened for editing
  React.useEffect(() => {
    if (open) {
      setType(transaction.type)
      setCategory(transaction.category)
      setAmount(String(transaction.amount))
      setDescription(transaction.description)
      setDate(new Date(transaction.date).toISOString().substring(0, 10))
    }
  }, [open, transaction])

  const categories = type === "income" ? incomeCategories : expenseCategories

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!amount || !description || !category) {
      toast.error("Please fill in all fields")
      return
    }

    editTransaction({
      id: transaction.id,
      date: new Date(date).toISOString(),
      description,
      amount: parseFloat(amount),
      type,
      category,
    })

    toast.success("Transaction updated!")
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Transaction</DialogTitle>
          <DialogDescription>
            Update the details of this transaction.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-2">
          {/* Type */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="edit-type" className="text-right">Type</Label>
            <div className="col-span-3">
              <Select value={type} onValueChange={(v) => { setType(v); setCategory("") }}>
                <SelectTrigger id="edit-type" className="w-full">
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
            <Label htmlFor="edit-desc" className="text-right">Description</Label>
            <Input
              id="edit-desc"
              placeholder="e.g. Coffee Shop"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="col-span-3"
            />
          </div>

          {/* Amount */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="edit-amount" className="text-right">Amount</Label>
            <Input
              id="edit-amount"
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
            <Label htmlFor="edit-category" className="text-right">Category</Label>
            <div className="col-span-3">
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger id="edit-category" className="w-full">
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
            <Label htmlFor="edit-date" className="text-right">Date</Label>
            <Input
              id="edit-date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="col-span-3"
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Save Changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
