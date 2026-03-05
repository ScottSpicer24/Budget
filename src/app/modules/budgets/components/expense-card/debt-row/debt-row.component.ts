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
  @Input() editMode = false;
  @Output() debtChange = new EventEmitter<Debt>();

  nameDisplay = '';
  pctDisplay = '';
  paymentDisplay = '';
  remainingDisplay = '';
  interestRateDisplay = '';
  minimumPaymentDisplay = '';

  nameError = '';
  paymentError = '';
  remainingError = '';
  interestRateError = '';
  minimumPaymentError = '';

  private nameFocused = false;
  private paymentFocused = false;
  private remainingFocused = false;
  private interestRateFocused = false;
  private minimumPaymentFocused = false;

  private get currentPct(): number {
    const monthlyPayment = this.debt.monthlyPayment ?? this.debt.minimumMonthlyPayment;
    return this.totalPayments > 0 ? (monthlyPayment / this.totalPayments) * 100 : 0;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['debt']) {
      if (!this.nameFocused) this.nameDisplay = this.debt.name;
      if (!this.paymentFocused) this.paymentDisplay = (this.debt.monthlyPayment ?? this.debt.minimumMonthlyPayment).toFixed(2);
      if (!this.remainingFocused) this.remainingDisplay = this.debt.remainingAmount.toFixed(2);
      if (!this.interestRateFocused) this.interestRateDisplay = (this.debt.interestRate * 100).toFixed(2);
      if (!this.minimumPaymentFocused) this.minimumPaymentDisplay = this.debt.minimumMonthlyPayment.toFixed(2);
    }
    if (changes['debt'] || changes['totalPayments']) {
      this.pctDisplay = this.currentPct.toFixed(1);
    }
  }

  onNameFocus() {
    this.nameFocused = true;
  }

  onPaymentFocus() {
    this.paymentFocused = true;
  }

  onRemainingFocus() {
    this.remainingFocused = true;
  }

  onInterestRateFocus() {
    this.interestRateFocused = true;
  }

  onMinimumPaymentFocus() {
    this.minimumPaymentFocused = true;
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

  onRemainingBlur() {
    this.remainingFocused = false;
    this.remainingError = '';
    const val = parseFloat(this.remainingDisplay);
    if (isNaN(val) || val < 0) {
      this.remainingError = 'Enter a value >= 0';
      this.remainingDisplay = this.debt.remainingAmount.toFixed(2);
      return;
    }
    this.debtChange.emit({ ...this.debt, remainingAmount: parseFloat(val.toFixed(2)) });
  }

  onInterestRateBlur() {
    this.interestRateFocused = false;
    this.interestRateError = '';
    const val = parseFloat(this.interestRateDisplay);
    if (isNaN(val) || val < 0) {
      this.interestRateError = 'Enter a value >= 0';
      this.interestRateDisplay = this.debt.interestRate.toFixed(2);
      return;
    }
    this.debtChange.emit({ ...this.debt, interestRate: parseFloat(val.toFixed(2)) });
  }

  onMinimumPaymentBlur() {
    this.minimumPaymentFocused = false;
    this.minimumPaymentError = '';
    const val = parseFloat(this.minimumPaymentDisplay);
    if (isNaN(val) || val < 0) {
      this.minimumPaymentError = 'Enter a value >= 0';
      this.minimumPaymentDisplay = this.debt.minimumMonthlyPayment.toFixed(2);
      return;
    }

    const nextMin = parseFloat(val.toFixed(2));
    const nextPayment = Math.max(this.debt.monthlyPayment ?? 0, nextMin);
    this.debtChange.emit({
      ...this.debt,
      minimumMonthlyPayment: nextMin,
      monthlyPayment: nextPayment,
    });
  }

  onPaymentBlur() {
    this.paymentFocused = false;
    this.paymentError = '';
    const val = parseFloat(this.paymentDisplay);

    if (isNaN(val)) {
      this.paymentError = 'Enter a valid dollar amount';
      this.paymentDisplay = (this.debt.monthlyPayment ?? this.debt.minimumMonthlyPayment).toFixed(2);
      return;
    }

    if (val < this.debt.minimumMonthlyPayment) {
      this.paymentError = `Payment must be at least $${this.debt.minimumMonthlyPayment.toFixed(2)}`;
      this.paymentDisplay = this.debt.minimumMonthlyPayment.toFixed(2);
      return;
    }

    const nextPayment = parseFloat(val.toFixed(2));
    this.debtChange.emit({ ...this.debt, monthlyPayment: nextPayment });
  }
}
