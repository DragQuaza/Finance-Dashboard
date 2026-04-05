# Finance Dashboard

**Live Demo:** https://finance-dashboard-ptn8n9swd-dragquazas-projects.vercel.app

A modern, responsive web application that lets users track and understand their financial activity — including transaction history, spending patterns, and personalized insights.

## Setup

```bash
git clone https://github.com/DragQuaza/Finance-Dashboard.git
cd Finance-Dashboard
npm install
npm run dev
```

---

## Features

### 1. Dashboard Overview
The main dashboard provides an at-a-glance summary of the user's finances:
- **Summary Cards** — Total Balance, Total Income, Total Expenses, and Savings Rate, each with contextual trend indicators.
- **Balance Trend Chart** — An interactive area chart showing balance over time, with 7-day, 30-day, and 90-day range filters.
- **Spending Breakdown** — A donut chart visualizing expense distribution across categories (Food, Transport, Housing, etc.).

### 2. Transactions Section
A full-featured transaction table that includes:
- **Date, Amount, Category, and Type** (Income / Expense) for each entry.
- **Search** — Filter transactions by description or category in real time.
- **Multi-column Filtering** — Filter by transaction type, category, and date range simultaneously.
- **Sorting** — Sort by any column (date, amount, category).
- **Pagination** — Navigate large datasets without overwhelming the UI.

### 3. Role-Based UI
Two roles are simulated entirely on the frontend, switchable via a dropdown in the header:
- **Viewer** — Read-only access. Can browse, search, and filter transactions.
- **Admin** — Full access. Can add new transactions, edit existing ones, and delete entries.

### 4. Insights Section
Automatically derived observations from the transaction data:
- Highest spending category for the current period.
- Month-over-month comparison of income vs. expenses.
- Overall financial health indicator based on savings rate.
- Weekly spending pattern summary.

### 5. State Management
All application state is managed through a centralized `FinanceContext` using React's built-in `useReducer`. This covers:
- Transaction data and CRUD operations.
- Active filters and search state.
- Selected user role.
- Derived/computed values (totals, category breakdowns, chart data).

No external state management library was used, keeping the bundle lean while maintaining predictable state flow.

### 6. UI & UX
- Clean, minimal design with clear visual hierarchy.
- Fully responsive layout — sidebar collapses on smaller screens.
- Empty state handling — charts and tables display appropriate fallbacks when no data matches the active filters.
- Dark and Light mode support, persisted across sessions.

---

## Enhancements Implemented

| Feature | Details |
|---|---|
| Dark Mode | Toggleable via header; preference saved to `localStorage` |
| Data Persistence | All transactions persist across page reloads via `localStorage` |
| Export Functionality | Filtered transactions exportable as CSV or JSON |
| Advanced Filtering | Filter by type, category, and date range simultaneously |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 19 (JavaScript/JSX) |
| Build Tool | Vite 6 |
| Styling | Tailwind CSS v4 |
| UI Components | Shadcn UI (Radix primitives) |
| Charts | Recharts 3 |
| Data Table | TanStack Table v8 |
| State Management | React Context + useReducer |

---

## Creative Enhancement

Added as a creative enhancement. When a backend is integrated, this structure can be used as-is.

UI elements like the **User Profile Menu (Account, Billing, Logout)** are included as thoughtful design touches for visual completeness, built to be fully functional once backend authentication is integrated.
