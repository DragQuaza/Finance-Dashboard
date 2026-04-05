import { subDays, subMonths, format } from "date-fns"

const today = new Date()

export const mockCategories = [
  "Groceries",
  "Entertainment",
  "Transport",
  "Shopping",
  "Utilities",
  "Food & Dining",
  "Health",
  "Housing",
  "Salary",
  "Freelance",
  "Investment",
  "Other",
]

export const incomeCategories = ["Salary", "Freelance", "Investment", "Other"]
export const expenseCategories = [
  "Groceries",
  "Entertainment",
  "Transport",
  "Shopping",
  "Utilities",
  "Food & Dining",
  "Health",
  "Housing",
  "Other",
]

export const mockTransactions = [
  // Current month
  { id: "t1", date: subDays(today, 1).toISOString(), description: "Whole Foods Market", amount: 156.40, type: "expense", category: "Groceries" },
  { id: "t2", date: subDays(today, 2).toISOString(), description: "Tech Corp Salary", amount: 4200.00, type: "income", category: "Salary" },
  { id: "t3", date: subDays(today, 3).toISOString(), description: "Netflix Subscription", amount: 15.99, type: "expense", category: "Entertainment" },
  { id: "t4", date: subDays(today, 4).toISOString(), description: "Uber Rides", amount: 34.50, type: "expense", category: "Transport" },
  { id: "t5", date: subDays(today, 5).toISOString(), description: "Amazon Purchases", amount: 120.00, type: "expense", category: "Shopping" },
  { id: "t6", date: subDays(today, 6).toISOString(), description: "Freelance Design Project", amount: 850.00, type: "income", category: "Freelance" },
  { id: "t7", date: subDays(today, 7).toISOString(), description: "PG&E Utility Bill", amount: 95.20, type: "expense", category: "Utilities" },
  { id: "t8", date: subDays(today, 8).toISOString(), description: "Coffee Shop", amount: 12.50, type: "expense", category: "Food & Dining" },
  { id: "t9", date: subDays(today, 10).toISOString(), description: "Gym Membership", amount: 50.00, type: "expense", category: "Health" },
  { id: "t10", date: subDays(today, 12).toISOString(), description: "Dinner with friends", amount: 85.00, type: "expense", category: "Food & Dining" },
  { id: "t11", date: subDays(today, 15).toISOString(), description: "Stock Dividend", amount: 120.50, type: "income", category: "Investment" },
  { id: "t12", date: subDays(today, 16).toISOString(), description: "Electric Bill", amount: 78.30, type: "expense", category: "Utilities" },
  { id: "t13", date: subDays(today, 18).toISOString(), description: "Target Shopping", amount: 234.00, type: "expense", category: "Shopping" },
  { id: "t14", date: subDays(today, 20).toISOString(), description: "Spotify Premium", amount: 9.99, type: "expense", category: "Entertainment" },
  // Last month
  { id: "t15", date: subDays(today, 32).toISOString(), description: "Monthly Rent", amount: 1500.00, type: "expense", category: "Housing" },
  { id: "t16", date: subDays(today, 33).toISOString(), description: "Tech Corp Salary", amount: 4200.00, type: "income", category: "Salary" },
  { id: "t17", date: subDays(today, 35).toISOString(), description: "Costco Groceries", amount: 210.00, type: "expense", category: "Groceries" },
  { id: "t18", date: subDays(today, 37).toISOString(), description: "Movie Tickets", amount: 45.00, type: "expense", category: "Entertainment" },
  { id: "t19", date: subDays(today, 38).toISOString(), description: "Gas Station", amount: 55.00, type: "expense", category: "Transport" },
  { id: "t20", date: subDays(today, 40).toISOString(), description: "Freelance Consulting", amount: 1200.00, type: "income", category: "Freelance" },
  { id: "t21", date: subDays(today, 42).toISOString(), description: "Doctor Visit", amount: 150.00, type: "expense", category: "Health" },
  { id: "t22", date: subDays(today, 44).toISOString(), description: "Internet Bill", amount: 65.00, type: "expense", category: "Utilities" },
  { id: "t23", date: subDays(today, 46).toISOString(), description: "Sushi Dinner", amount: 78.50, type: "expense", category: "Food & Dining" },
  // 2 months ago
  { id: "t24", date: subDays(today, 62).toISOString(), description: "Monthly Rent", amount: 1500.00, type: "expense", category: "Housing" },
  { id: "t25", date: subDays(today, 63).toISOString(), description: "Tech Corp Salary", amount: 4200.00, type: "income", category: "Salary" },
  { id: "t26", date: subDays(today, 65).toISOString(), description: "Nike Running Shoes", amount: 129.99, type: "expense", category: "Shopping" },
  { id: "t27", date: subDays(today, 67).toISOString(), description: "Trader Joe's", amount: 89.00, type: "expense", category: "Groceries" },
  { id: "t28", date: subDays(today, 70).toISOString(), description: "Concert Tickets", amount: 95.00, type: "expense", category: "Entertainment" },
  { id: "t29", date: subDays(today, 72).toISOString(), description: "Dividend Payout", amount: 85.75, type: "income", category: "Investment" },
  // 3 months ago
  { id: "t30", date: subDays(today, 92).toISOString(), description: "Monthly Rent", amount: 1500.00, type: "expense", category: "Housing" },
  { id: "t31", date: subDays(today, 93).toISOString(), description: "Tech Corp Salary", amount: 4200.00, type: "income", category: "Salary" },
  { id: "t32", date: subDays(today, 95).toISOString(), description: "Whole Foods", amount: 178.00, type: "expense", category: "Groceries" },
  { id: "t33", date: subDays(today, 97).toISOString(), description: "Lyft Rides", amount: 42.00, type: "expense", category: "Transport" },
  { id: "t34", date: subDays(today, 100).toISOString(), description: "Freelance Writing", amount: 600.00, type: "income", category: "Freelance" },
  // 4-5 months ago
  { id: "t35", date: subDays(today, 122).toISOString(), description: "Monthly Rent", amount: 1500.00, type: "expense", category: "Housing" },
  { id: "t36", date: subDays(today, 123).toISOString(), description: "Tech Corp Salary", amount: 4200.00, type: "income", category: "Salary" },
  { id: "t37", date: subDays(today, 125).toISOString(), description: "Pharmacy", amount: 35.00, type: "expense", category: "Health" },
  { id: "t38", date: subDays(today, 128).toISOString(), description: "Steam Games", amount: 59.99, type: "expense", category: "Entertainment" },
  { id: "t39", date: subDays(today, 152).toISOString(), description: "Monthly Rent", amount: 1500.00, type: "expense", category: "Housing" },
  { id: "t40", date: subDays(today, 153).toISOString(), description: "Tech Corp Salary", amount: 4200.00, type: "income", category: "Salary" },
  { id: "t41", date: subDays(today, 155).toISOString(), description: "IKEA Furniture", amount: 349.00, type: "expense", category: "Shopping" },
  { id: "t42", date: subDays(today, 158).toISOString(), description: "Freelance App Dev", amount: 2000.00, type: "income", category: "Freelance" },
]
