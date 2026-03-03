import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { Debt } from '../../../../../shared/models/budget';

@Component({
  selector: 'app-debt-row',
  imports: [FormsModule, AngularSvgIconModule],
  templateUrl: './debt-row.component.html',
})
export class DebtRowComponent implements OnChanges {
  @Input() debt!: Debt;
  @Input() index!: number;
  @Input() totalPayments!: number;
  @Output() debtChange = new EventEmitter<Debt>();

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
    return this.totalPayments > 0 ? (this.debt.minimumMonthlyPayment / this.totalPayments) * 100 : 0;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['debt']) {
      if (!this.nameFocused) this.nameDisplay = this.debt.name;
      if (!this.amtFocused) this.amtDisplay = this.debt.minimumMonthlyPayment.toFixed(2);
    }
    if (changes['debt'] || changes['totalPayments']) {
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
      this.nameDisplay = this.debt.name;
      return;
    }
    if (trimmed !== this.debt.name) {
      this.debtChange.emit({ ...this.debt, name: trimmed });
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
    const newAmt = parseFloat(((val / 100) * this.totalPayments).toFixed(2));
    this.amtDisplay = newAmt.toFixed(2);
    this.debtChange.emit({ ...this.debt, minimumMonthlyPayment: newAmt });
  }

  onAmtBlur() {
    this.amtFocused = false;
    this.amtError = '';
    const val = parseFloat(this.amtDisplay);
    if (isNaN(val) || val < 0) {
      this.amtError = 'Enter a value ≥ 0';
      this.amtDisplay = this.debt.minimumMonthlyPayment.toFixed(2);
      return;
    }
    this.debtChange.emit({ ...this.debt, minimumMonthlyPayment: val });
  }
}
