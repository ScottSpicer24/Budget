import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { SavingsGoal } from '../../../../../shared/models/budget';

@Component({
  selector: 'app-savings-goal-row',
  imports: [FormsModule, AngularSvgIconModule],
  templateUrl: './savings-goal-row.component.html',
})
export class SavingsGoalRowComponent implements OnChanges {
  // Inputs from the parent component (lines 61-65 savings-card.html) from the dummy JSON file
  @Input() goal!: SavingsGoal;
  @Input() allocatedAmount = 0;
  @Input() maxAllocatable = 0;
  @Input() locked = true;
  @Input() confirmingDelete = false;

  // Outputs for the parent component, when emitted, triggers a function call (lines 66-70 savings-card.html)
  @Output() goalChange = new EventEmitter<SavingsGoal>();
  @Output() toggleLock = new EventEmitter<void>();
  @Output() requestDelete = new EventEmitter<void>();
  @Output() confirmDelete = new EventEmitter<void>();
  @Output() cancelDelete = new EventEmitter<void>();

  // variables for values displayed
  nameDisplay = '';
  allocatedDisplay = '';
  targetDisplay = '';
  monthlyDisplay = '';

  // variables for tracking focus
  private nameFocused = false;
  private allocatedFocused = false;
  private targetFocused = false;
  private monthlyFocused = false;

  formatCurrency(value: number): string {
    return value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  // With get --> it's a getter, accessed like a property...
  // so you can write progressPercent instead of progressPercent() and it calculates it every time.
  get progressPercent(): number {
    if (this.goal.targetAmount <= 0) return 0;
    return Math.min((this.allocatedAmount / this.goal.targetAmount) * 100, 100);
  }

  // when any of the @Inputs change from parent, update their display values IF they are not being used.
  ngOnChanges(changes: SimpleChanges) {
    if (changes['goal'] || changes['allocatedAmount']) {
      if (!this.nameFocused) this.nameDisplay = this.goal.name;
      if (!this.allocatedFocused) this.allocatedDisplay = this.allocatedAmount.toFixed(2);
      if (!this.targetFocused) this.targetDisplay = this.goal.targetAmount.toFixed(2);
      if (!this.monthlyFocused) this.monthlyDisplay = (this.goal.monthlyContribution ?? 0).toFixed(2);
    }
  }

  // Set the element to be focused to prevent race conditions with other components during ngOnChanges.
  onNameFocus() {
    this.nameFocused = true;
  }
  onAllocatedFocus() {
    this.allocatedFocused = true;
  }
  onTargetFocus() {
    this.targetFocused = true;
  }
  onMonthlyFocus() {
    this.monthlyFocused = true;
  }

  /*
  When a input loses focus (blurs), call these functions to emit a change to the @Output goalChange
  This emit triggers the function in the parent-component-ts file that is specified in the parents-html file
  savings-card.component.ts file lines 83+
  savings-card.html file lines 66-70
  */
  onNameBlur() {
    this.nameFocused = false;
    const trimmed = this.nameDisplay.trim();
    if (!trimmed) {
      this.nameDisplay = this.goal.name;
      return;
    }
    if (trimmed !== this.goal.name) {
      this.goalChange.emit({ ...this.goal, name: trimmed });
    }
  }

  onAllocatedBlur() {
    this.allocatedFocused = false;
    const val = parseFloat(this.allocatedDisplay);
    if (isNaN(val) || val < 0) {
      this.allocatedDisplay = this.allocatedAmount.toFixed(2);
      return;
    }
    const clamped = Math.min(val, this.maxAllocatable, this.goal.targetAmount);
    const now = new Date();
    this.goalChange.emit({
      ...this.goal,
      fillFull: false,
      currentAmount: clamped,
      lastUpdatedMonth: now.getMonth() + 1,
      lastUpdatedYear: now.getFullYear(),
      monthlyContribution: this.goal.monthlyContribution ?? 0,
    });
  }

  onTargetBlur() {
    this.targetFocused = false;
    const val = parseFloat(this.targetDisplay);
    if (isNaN(val) || val < 0) {
      this.targetDisplay = this.goal.targetAmount.toFixed(2);
      return;
    }
    this.goalChange.emit({ ...this.goal, targetAmount: parseFloat(val.toFixed(2)) });
  }

  onMonthlyBlur() {
    this.monthlyFocused = false;
    const val = parseFloat(this.monthlyDisplay);
    if (isNaN(val) || val < 0) {
      this.monthlyDisplay = (this.goal.monthlyContribution ?? 0).toFixed(2);
      return;
    }
    this.goalChange.emit({ ...this.goal, monthlyContribution: parseFloat(val.toFixed(2)) });
  }

  onToggleFillFull() {
    const newFillFull = !this.goal.fillFull;
    const updated: SavingsGoal = { ...this.goal, fillFull: newFillFull };
    if (!newFillFull) {
      const now = new Date();
      updated.currentAmount = updated.currentAmount ?? 0;
      updated.monthlyContribution = updated.monthlyContribution ?? 0;
      updated.lastUpdatedMonth = now.getMonth() + 1;
      updated.lastUpdatedYear = now.getFullYear();
    }
    this.goalChange.emit(updated);
  }
}
