import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { BudgetPlan, Debt, Expense, Income, SavingsGoal } from '../../shared/models/budget';

@Injectable()
export class BudgetPlanService {
  private http = inject(HttpClient);

  private _budgetPlan = signal<BudgetPlan | null>(null);
  readonly budgetPlan = this._budgetPlan.asReadonly();

  readonly totalIncome = computed(() => this._budgetPlan()?.incomes.reduce((sum, i) => sum + i.amount, 0) ?? 0);

  readonly totalExpenses = computed(() => this._budgetPlan()?.espense.reduce((sum, e) => sum + e.amount, 0) ?? 0);

  readonly totalDebtPayments = computed(
    () => this._budgetPlan()?.debts.reduce((sum, d) => sum + (d.monthlyPayment ?? d.minimumMonthlyPayment), 0) ?? 0,
  );

  readonly totalPayments = computed(() => this.totalExpenses() + this.totalDebtPayments());

  readonly savingsGoals = computed(() =>
    [...(this._budgetPlan()?.savingsGoal ?? [])].sort((a, b) => a.priority - b.priority),
  );

  constructor() {
    this.load();
  }

  private load() {
    this.http.get<any>('assets/data/budget-plan.json').subscribe((data) => {
      const incomes: Income[] = Array.isArray(data.incomes)
        ? data.incomes.map((i: any) => ({ name: i.name, amount: i.amount }))
        : [{ name: 'Primary Income', amount: data.income ?? 0 }];

      const expenses: Expense[] = (data.espense || []).map((e: any) => ({
        name: e.name,
        need: e.need,
        amount: e.amount,
        spent: e.spent ?? 0,
      }));

      const debts: Debt[] = (data.debts || []).map((d: any) => ({
        name: d.name,
        totalAmount: d.totalAmount ?? 0,
        remainingAmount: d.remainingAmount ?? d.totalAmount ?? 0,
        interestRate: d.interestRate ?? 0,
        minimumMonthlyPayment: d.minimumMonthlyPayment ?? 0,
        monthlyPayment: d.monthlyPayment ?? d.minimumMonthlyPayment ?? 0,
      }));

      const savingsGoals: SavingsGoal[] = (data.savingsGoals || data.savingsGoal || [])
        .map((g: any) => ({
          name: g.name ?? 'Unnamed',
          priority: g.priority ?? 0,
          targetAmount: g.targetAmount ?? 0,
          fillFull: g.fillFull ?? true,
          currentAmount: g.currentAmount,
          monthlyContribution: g.monthlyContribution,
          lastUpdatedMonth: g.lastUpdatedMonth,
          lastUpdatedYear: g.lastUpdatedYear,
        }))
        .sort((a: SavingsGoal, b: SavingsGoal) => a.priority - b.priority);

      const plan: BudgetPlan = {
        incomes,
        savingsGoal: savingsGoals,
        espense: expenses,
        debts,
      };

      this._budgetPlan.set(plan);
    });
  }

  updateExpense(index: number, updated: Expense) {
    const plan = this._budgetPlan();
    if (!plan) return;
    const newExpenses = [...plan.espense];
    newExpenses[index] = { ...updated };
    const newPlan = { ...plan, espense: newExpenses };
    this._budgetPlan.set(newPlan);
  }

  addExpense(need: boolean) {
    const plan = this._budgetPlan();
    if (!plan) return;
    const newExpense: Expense = { name: 'New Expense', need, amount: 0, spent: 0 };
    const newPlan = { ...plan, espense: [...plan.espense, newExpense] };
    this._budgetPlan.set(newPlan);
  }

  updateDebt(index: number, updated: Debt) {
    const plan = this._budgetPlan();
    if (!plan) return;
    const newDebts = [...plan.debts];
    newDebts[index] = { ...updated };
    this._budgetPlan.set({ ...plan, debts: newDebts });
  }

  addDebt() {
    const plan = this._budgetPlan();
    if (!plan) return;
    const newTotalAmount = 0;
    const newDebt: Debt = {
      name: 'New Debt',
      totalAmount: newTotalAmount,
      remainingAmount: newTotalAmount,
      interestRate: 0,
      minimumMonthlyPayment: 0,
      monthlyPayment: 0,
    };
    this._budgetPlan.set({ ...plan, debts: [...plan.debts, newDebt] });
  }

  commitIncomes(incomes: Income[]) {
    const plan = this._budgetPlan();
    if (!plan) return;
    this._budgetPlan.set({ ...plan, incomes: [...incomes] });
  }

  removeExpense(index: number) {
    const plan = this._budgetPlan();
    if (!plan) return;
    const newExpenses = [...plan.espense];
    newExpenses.splice(index, 1);
    this._budgetPlan.set({ ...plan, espense: newExpenses });
  }

  removeDebt(index: number) {
    const plan = this._budgetPlan();
    if (!plan) return;
    const newDebts = [...plan.debts];
    newDebts.splice(index, 1);
    this._budgetPlan.set({ ...plan, debts: newDebts });
  }

  updateSavingsGoal(index: number, updated: SavingsGoal) {
    const plan = this._budgetPlan();
    if (!plan) return;
    const sorted = [...plan.savingsGoal].sort((a, b) => a.priority - b.priority);
    sorted[index] = { ...updated };
    this._budgetPlan.set({ ...plan, savingsGoal: sorted });
  }

  addSavingsGoal() {
    const plan = this._budgetPlan();
    if (!plan) return;
    const maxPriority = plan.savingsGoal.reduce((max, g) => Math.max(max, g.priority), 0);
    const newGoal: SavingsGoal = {
      name: 'New Goal',
      priority: maxPriority + 1,
      targetAmount: 0,
      fillFull: true,
    };
    this._budgetPlan.set({ ...plan, savingsGoal: [...plan.savingsGoal, newGoal] });
  }

  removeSavingsGoal(index: number) {
    const plan = this._budgetPlan();
    if (!plan) return;
    const sorted = [...plan.savingsGoal].sort((a, b) => a.priority - b.priority);
    sorted.splice(index, 1);
    const renumbered = sorted.map((g, i) => ({ ...g, priority: i + 1 }));
    this._budgetPlan.set({ ...plan, savingsGoal: renumbered });
  }

  reorderSavingsGoals(goals: SavingsGoal[]) {
    const plan = this._budgetPlan();
    if (!plan) return;
    const reordered = goals.map((g, i) => ({ ...g, priority: i + 1 }));
    this._budgetPlan.set({ ...plan, savingsGoal: reordered });
  }
}
