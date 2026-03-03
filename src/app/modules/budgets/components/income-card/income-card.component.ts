import { computed, Component, effect, inject, signal } from '@angular/core';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { BudgetPlanService } from '../../../../core/services/budget-plan.service';
import { Income } from '../../../../shared/models/budget';
import { IncomeRowComponent } from './income-row/income-row.component';

@Component({
  selector: 'app-income-card',
  imports: [AngularSvgIconModule, IncomeRowComponent],
  templateUrl: './income-card.component.html',
})
export class IncomeCardComponent {
  protected service = inject(BudgetPlanService);

  // Local draft — only committed to the service when Save is pressed
  protected draft = signal<Income[]>([]);
  protected saved = signal(false);
  private saveTimer: ReturnType<typeof setTimeout> | null = null;

  protected totalDraftIncome = computed(() => this.draft().reduce((sum, i) => sum + i.amount, 0));

  constructor() {
    // Initialise draft from service once the plan loads
    effect(() => {
      const incomes = this.service.budgetPlan()?.incomes;
      if (incomes && this.draft().length === 0) {
        this.draft.set(incomes.map((i) => ({ ...i })));
      }
    });
  }

  protected onRowChange(index: number, updated: Income) {
    this.draft.update((rows) => rows.map((r, i) => (i === index ? { ...updated } : r)));
    this.saved.set(false);
  }

  protected addIncome() {
    this.draft.update((rows) => [...rows, { name: 'New Income', amount: 0 }]);
    this.saved.set(false);
  }

  protected save() {
    this.service.commitIncomes(this.draft());
    this.saved.set(true);
    if (this.saveTimer) clearTimeout(this.saveTimer);
    this.saveTimer = setTimeout(() => this.saved.set(false), 2500);
  }
}
