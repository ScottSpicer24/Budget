import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { Income } from '../../../../../shared/models/budget';

@Component({
  selector: 'app-income-row',
  imports: [FormsModule, AngularSvgIconModule],
  templateUrl: './income-row.component.html',
})
export class IncomeRowComponent implements OnChanges {
  @Input() income!: Income;
  @Input() totalIncome!: number;
  @Output() incomeChange = new EventEmitter<Income>();

  nameDisplay = '';
  amtDisplay = '';

  nameError = '';
  amtError = '';

  private nameFocused = false;
  private amtFocused = false;

  get percentage(): string {
    if (!this.totalIncome || this.totalIncome === 0) return '0.0';
    return ((this.income.amount / this.totalIncome) * 100).toFixed(1);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['income']) {
      if (!this.nameFocused) this.nameDisplay = this.income.name;
      if (!this.amtFocused) this.amtDisplay = this.income.amount.toFixed(2);
    }
  }

  onNameFocus() {
    this.nameFocused = true;
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
      this.nameDisplay = this.income.name;
      return;
    }
    if (trimmed !== this.income.name) {
      this.incomeChange.emit({ ...this.income, name: trimmed });
    }
  }

  onAmtBlur() {
    this.amtFocused = false;
    this.amtError = '';
    const val = parseFloat(this.amtDisplay);
    if (isNaN(val) || val < 0) {
      this.amtError = 'Enter a value ≥ 0';
      this.amtDisplay = this.income.amount.toFixed(2);
      return;
    }
    if (val !== this.income.amount) {
      this.incomeChange.emit({ ...this.income, amount: val });
    }
  }
}
