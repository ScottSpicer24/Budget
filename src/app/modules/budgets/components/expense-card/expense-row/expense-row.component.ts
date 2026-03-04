import { Component, EventEmitter, inject, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { Expense } from '../../../../../shared/models/budget';
import { BudgetPlanService } from '../../../../../core/services/budget-plan.service';

@Component({
  selector: 'app-expense-row',
  imports: [FormsModule, AngularSvgIconModule],
  templateUrl: './expense-row.component.html',
})
export class ExpenseRowComponent implements OnChanges {
  @Input() expense!: Expense;
  @Input() index!: number;
  @Input() totalPayments!: number;
  @Output() expenseChange = new EventEmitter<Expense>();

  nameDisplay = '';
  pctDisplay = '';
  amtDisplay = '';

  nameError = '';
  pctError = '';
  amtError = '';

  private nameFocused = false;
  private pctFocused = false;
  private amtFocused = false;

  private get currentPct(): number {
    return this.totalPayments > 0 ? (this.expense.amount / this.totalPayments) * 100 : 0;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['expense']) {
      if (!this.nameFocused) this.nameDisplay = this.expense.name;
      if (!this.amtFocused) this.amtDisplay = this.expense.amount.toFixed(2);
    }
    if (changes['expense'] || changes['totalPayments']) {
      if (!this.pctFocused) this.pctDisplay = this.currentPct.toFixed(1);
    }
  }

  onNameFocus() {
    this.nameFocused = true;
  }

  onPctFocus() {
    this.pctFocused = true;
  }

  onAmtFocus() {
    this.amtFocused = true;
  }

  onNameBlur() {
    this.nameFocused = false;
    this.nameError = '';
    const trimmed = this.nameDisplay.trim();
    if (!trimmed) {
      this.nameError = 'Name is required';
      this.nameDisplay = this.expense.name;
      return;
    }
    if (trimmed !== this.expense.name) {
      this.expenseChange.emit({ ...this.expense, name: trimmed });
    }
  }

  onPctBlur() {
    this.pctFocused = false;
    this.pctError = '';
    const val = parseFloat(this.pctDisplay);
    if (isNaN(val) || val < 0 || val > 100) {
      this.pctError = 'Enter a value 0 - 100';
      this.pctDisplay = this.currentPct.toFixed(1);
      return;
    }
    const newAmount = parseFloat(((val / 100) * this.totalPayments).toFixed(2));
    this.amtDisplay = newAmount.toFixed(2);
    this.expenseChange.emit({ ...this.expense, amount: newAmount });
  }

  onAmtBlur() {
    this.amtFocused = false;
    this.amtError = '';
    const val = parseFloat(this.amtDisplay);
    if (isNaN(val) || val < 0) {
      this.amtError = 'Enter a value ≥ 0';
      this.amtDisplay = this.expense.amount.toFixed(2);
      return;
    }
    this.expenseChange.emit({ ...this.expense, amount: val });
  }
}
