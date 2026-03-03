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
  savingsGoal: number;
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
  spent: number;
}

export interface Debt {
  name: string;
  totalAmount: number;
  remainingAmount: number;
  interestRate: number;
  minimumMonthlyPayment: number;
}

