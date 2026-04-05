import React, { createContext, useContext, useReducer, useEffect } from "react"
import { mockTransactions } from "../data/mockData"

const FinanceContext = createContext(null)

const STORAGE_KEY = "finance_dashboard_data"

function loadFromStorage() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored)
      return parsed.transactions || null
    }
  } catch {
    // Ignore parse errors
  }
  return null
}

function saveToStorage(transactions) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ transactions }))
  } catch {
    // Ignore storage errors
  }
}

const initialState = {
  transactions: [],
  filters: {
    type: "all",
    category: "all",
    searchQuery: "",
    dateRange: "all",
  },
  role: "admin",
}

function financeReducer(state, action) {
  switch (action.type) {
    case "SET_INITIAL_DATA":
      return { ...state, transactions: action.payload }
    case "ADD_TRANSACTION": {
      const updated = [action.payload, ...state.transactions]
      saveToStorage(updated)
      return { ...state, transactions: updated }
    }
    case "EDIT_TRANSACTION": {
      const updated = state.transactions.map((t) =>
        t.id === action.payload.id ? { ...t, ...action.payload } : t
      )
      saveToStorage(updated)
      return { ...state, transactions: updated }
    }
    case "DELETE_TRANSACTION": {
      const updated = state.transactions.filter((t) => t.id !== action.payload)
      saveToStorage(updated)
      return { ...state, transactions: updated }
    }
    case "SET_FILTER":
      return {
        ...state,
        filters: { ...state.filters, ...action.payload },
      }
    case "RESET_FILTERS":
      return {
        ...state,
        filters: initialState.filters,
      }
    case "SET_ROLE":
      return { ...state, role: action.payload }
    default:
      return state
  }
}

export function FinanceProvider({ children }) {
  const [state, dispatch] = useReducer(financeReducer, initialState)

  // Initialize data from localStorage or mock data
  useEffect(() => {
    const stored = loadFromStorage()
    dispatch({
      type: "SET_INITIAL_DATA",
      payload: stored || mockTransactions,
    })
  }, [])

  // Computed values
  const totalIncome = state.transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0)

  const totalExpenses = state.transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0)

  const totalBalance = totalIncome - totalExpenses

  const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0

  // Filtered transactions
  const filteredTransactions = state.transactions.filter((t) => {
    if (state.filters.type !== "all" && t.type !== state.filters.type) return false
    if (state.filters.category !== "all" && t.category !== state.filters.category) return false
    if (state.filters.searchQuery) {
      const q = state.filters.searchQuery.toLowerCase()
      const matchesDesc = t.description.toLowerCase().includes(q)
      const matchesCat = t.category.toLowerCase().includes(q)
      const matchesAmount = t.amount.toString().includes(q)
      if (!matchesDesc && !matchesCat && !matchesAmount) return false
    }
    if (state.filters.dateRange !== "all") {
      const txDate = new Date(t.date)
      const now = new Date()
      const daysAgo = Math.floor((now - txDate) / (1000 * 60 * 60 * 24))
      if (state.filters.dateRange === "7d" && daysAgo > 7) return false
      if (state.filters.dateRange === "30d" && daysAgo > 30) return false
      if (state.filters.dateRange === "90d" && daysAgo > 90) return false
    }
    return true
  })

  // Category breakdown
  const categoryBreakdown = state.transactions
    .filter((t) => t.type === "expense")
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount
      return acc
    }, {})

  // Monthly data for charts
  const monthlyData = (() => {
    const months = {}
    state.transactions.forEach((t) => {
      const monthKey = new Date(t.date).toISOString().substring(0, 7) // YYYY-MM
      if (!months[monthKey]) {
        months[monthKey] = { month: monthKey, income: 0, expenses: 0 }
      }
      if (t.type === "income") months[monthKey].income += t.amount
      else months[monthKey].expenses += t.amount
    })
    return Object.values(months)
      .sort((a, b) => a.month.localeCompare(b.month))
      .map((m) => ({
        ...m,
        balance: m.income - m.expenses,
      }))
  })()

  // Insights
  const highestCategory = Object.entries(categoryBreakdown).sort(
    (a, b) => b[1] - a[1]
  )[0]

  const lowestCategory = Object.entries(categoryBreakdown).sort(
    (a, b) => a[1] - b[1]
  )[0]

  const currentMonthExpenses = state.transactions
    .filter((t) => {
      const txMonth = new Date(t.date).getMonth()
      const currentMonth = new Date().getMonth()
      return t.type === "expense" && txMonth === currentMonth
    })
    .reduce((s, t) => s + t.amount, 0)

  const lastMonthExpenses = state.transactions
    .filter((t) => {
      const txMonth = new Date(t.date).getMonth()
      const lastMonth = (new Date().getMonth() - 1 + 12) % 12
      return t.type === "expense" && txMonth === lastMonth
    })
    .reduce((s, t) => s + t.amount, 0)

  const monthlyChange =
    lastMonthExpenses > 0
      ? ((currentMonthExpenses - lastMonthExpenses) / lastMonthExpenses) * 100
      : 0

  const avgTransactionAmount =
    state.transactions.length > 0
      ? state.transactions.reduce((s, t) => s + t.amount, 0) / state.transactions.length
      : 0

  const value = {
    ...state,
    filteredTransactions,
    totalIncome,
    totalExpenses,
    totalBalance,
    savingsRate,
    categoryBreakdown,
    monthlyData,
    highestCategory,
    lowestCategory,
    currentMonthExpenses,
    lastMonthExpenses,
    monthlyChange,
    avgTransactionAmount,
    dispatch,
    addTransaction: (transaction) =>
      dispatch({ type: "ADD_TRANSACTION", payload: transaction }),
    editTransaction: (transaction) =>
      dispatch({ type: "EDIT_TRANSACTION", payload: transaction }),
    deleteTransaction: (id) =>
      dispatch({ type: "DELETE_TRANSACTION", payload: id }),
    setFilter: (filterUpdate) =>
      dispatch({ type: "SET_FILTER", payload: filterUpdate }),
    resetFilters: () => dispatch({ type: "RESET_FILTERS" }),
    setRole: (role) => dispatch({ type: "SET_ROLE", payload: role }),
    resetData: () => {
      localStorage.removeItem(STORAGE_KEY)
      dispatch({ type: "SET_INITIAL_DATA", payload: mockTransactions })
    },
  }

  return (
    <FinanceContext.Provider value={value}>{children}</FinanceContext.Provider>
  )
}

export function useFinance() {
  const context = useContext(FinanceContext)
  if (!context) {
    throw new Error("useFinance must be used within a FinanceProvider")
  }
  return context
}
