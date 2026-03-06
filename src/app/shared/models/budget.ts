import { ExpenseRowComponent } from './../../modules/budgets/components/expense-card/expense-row/expense-row.component';
export interface Account {
  id: number;
  bank: string;
  type: string;
  balance: number;
}

export interface Transaction {
  id: number;
  item: string;
  amount: number;
  date: string;
  account: string;
  type?: string;
}

export interface Budget {
  id: number;
  Category: string;
  Amount: number;
}

export interface BudgetPlan {
  incomes: Income[];
  espense: Expense[];
  savingsGoal: SavingsGoal[];
  debts: Debt[];
}

export interface Income {
  name: string;
  amount: number;
}

export interface Expense {
  name: string;
  need: boolean;
  amount: number;
}

export interface Debt {
  name: string;
  totalAmount: number;
  remainingAmount: number;
  interestRate: number;
  minimumMonthlyPayment: number;
  monthlyPayment: number;
}

export interface SavingsGoal {
  name: string;
  priority: number;
  targetAmount: number;
  fillFull: boolean;
  currentAmount?: number;
  monthlyContribution?: number;
  lastUpdatedMonth?: number;
  lastUpdatedYear?: number;
}

export interface SpendingCategory {
  expense: Expense;
  transactions: Transaction[];
  totalSpent: number;
  over: boolean;
}
