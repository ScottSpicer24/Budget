import { computed, Component, inject } from '@angular/core';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { BudgetPlanService } from '../../../../core/services/budget-plan.service';
import { Debt, Expense } from '../../../../shared/models/budget';
import { DebtRowComponent } from './debt-row/debt-row.component';
import { ExpenseRowComponent } from './expense-row/expense-row.component';

@Component({
  selector: 'app-expense-card',
  imports: [AngularSvgIconModule, ExpenseRowComponent, DebtRowComponent],
  templateUrl: './expense-card.component.html',
})
export class ExpenseCardComponent {
  protected service = inject(BudgetPlanService);
  protected editableDebtIndexes = new Set<number>();

  protected needs = computed(() =>
    (this.service.budgetPlan()?.espense ?? []).map((expense, index) => ({ expense, index })).filter(({ expense }) => expense.need),
  );

  protected wants = computed(() =>
    (this.service.budgetPlan()?.espense ?? []).map((expense, index) => ({ expense, index })).filter(({ expense }) => !expense.need),
  );

  protected debts = computed(() =>
    (this.service.budgetPlan()?.debts ?? []).map((debt, index) => ({ debt, index }))
  );

  onExpenseChange(index: number, expense: Expense) {
    this.service.updateExpense(index, expense);
  }

  onDebtChange(index: number, debt: Debt) {
    this.service.updateDebt(index, debt);
  }

  addNeed() {
    this.service.addExpense(true);
  }

  addWant() {
    this.service.addExpense(false);
  }

  addDebt() {
    const nextIndex = this.debts().length;
    this.service.addDebt();
    this.editableDebtIndexes.add(nextIndex);
  }

  removeExpense(index: number) {
    this.service.removeExpense(index);
  }

  removeDebt(index: number) {
    this.service.removeDebt(index);
    const next = new Set<number>();
    this.editableDebtIndexes.forEach((idx) => {
      if (idx < index) next.add(idx);
      if (idx > index) next.add(idx - 1);
    });
    this.editableDebtIndexes = next;
  }

  toggleDebtEdit(index: number) {
    if (this.editableDebtIndexes.has(index)) {
      this.editableDebtIndexes.delete(index);
      return;
    }
    this.editableDebtIndexes.add(index);
  }

  isDebtEditable(index: number): boolean {
    return this.editableDebtIndexes.has(index);
  }
}
