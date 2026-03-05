import { Component, computed, inject, signal } from '@angular/core';
import { CdkDragDrop, CdkDrag, CdkDropList, CdkDragHandle, moveItemInArray } from '@angular/cdk/drag-drop';
import { CurrencyPipe } from '@angular/common';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { BudgetPlanService } from '../../../../core/services/budget-plan.service';
import { Account, SavingsGoal } from '../../../../shared/models/budget';
import { SavingsGoalRowComponent } from './savings-goal-row/savings-goal-row.component';
import accountsData from '../../../../../assets/data/accounts.json';

export interface GoalAllocation {
  goal: SavingsGoal;
  allocated: number;
  maxAllocatable: number;
  index: number;
}

@Component({
  selector: 'app-savings-card',
  imports: [AngularSvgIconModule, CurrencyPipe, CdkDropList, CdkDrag, CdkDragHandle, SavingsGoalRowComponent],
  templateUrl: './savings-card.component.html',
  styles: `
    .cdk-drag-placeholder {
      opacity: 0.3;
    }
    .cdk-drag-animating {
      transition: transform 250ms cubic-bezier(0, 0, 0.2, 1);
    }
    .cdk-drop-list-dragging .cdk-drag:not(.cdk-drag-placeholder) {
      transition: transform 250ms cubic-bezier(0, 0, 0.2, 1);
    }
  `,
})
export class SavingsCardComponent {
  protected service = inject(BudgetPlanService);

  protected savingsAccounts: Account[] = (accountsData as Account[]).filter((a) => a.type === 'savings');
  protected totalSavings = this.savingsAccounts.reduce((sum, a) => sum + a.balance, 0);

  protected unlockedIndexes = new Set<number>();
  protected confirmingDeleteIndex = signal<number | null>(null);

  protected allocations = computed(() => {
    const goals = this.service.savingsGoals();
    let remaining = this.totalSavings;
    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();

    return goals.map((goal, index) => {
      const maxAllocatable = remaining;
      let targetAllocation: number;

      if (goal.fillFull) {
        targetAllocation = goal.targetAmount;
      } else {
        const currentVal = ((currentYear - 2000) * 12) + currentMonth;
        const lastVal = (((goal.lastUpdatedYear ?? currentYear) - 2000) * 12) + (goal.lastUpdatedMonth ?? currentMonth);
        console.log(currentVal, lastVal);
        const monthsElapsed = currentVal - lastVal;
        const totalSaved = (goal.currentAmount ?? 0) + monthsElapsed * (goal.monthlyContribution ?? 0);
        targetAllocation = Math.min(totalSaved, goal.targetAmount);
      }

      const allocated = Math.min(Math.max(targetAllocation, 0), remaining);
      remaining -= allocated;

      return { goal, allocated, maxAllocatable, index } as GoalAllocation;
    });
  });

  protected extraSavings = computed(() => {
    const totalAllocated = this.allocations().reduce((sum, a) => sum + a.allocated, 0);
    return Math.max(this.totalSavings - totalAllocated, 0);
  });

  onDrop(event: CdkDragDrop<GoalAllocation[]>) {
    const goals = this.allocations().map((a) => a.goal);
    moveItemInArray(goals, event.previousIndex, event.currentIndex);
    this.service.reorderSavingsGoals(goals);
    this.unlockedIndexes.clear();
    this.confirmingDeleteIndex.set(null);
  }

  onGoalChange(index: number, updated: SavingsGoal) {
    this.service.updateSavingsGoal(index, updated);
  }

  addGoal() {
    this.service.addSavingsGoal();
    const count = (this.service.budgetPlan()?.savingsGoal ?? []).length;
    this.unlockedIndexes.add(count - 1);
  }

  toggleLock(index: number) {
    if (this.unlockedIndexes.has(index)) {
      this.unlockedIndexes.delete(index);
    } else {
      this.unlockedIndexes.add(index);
    }
  }

  isUnlocked(index: number): boolean {
    return this.unlockedIndexes.has(index);
  }

  requestDelete(index: number) {
    this.confirmingDeleteIndex.set(index);
  }

  confirmDelete(index: number) {
    this.service.removeSavingsGoal(index);
    this.confirmingDeleteIndex.set(null);
    const next = new Set<number>();
    this.unlockedIndexes.forEach((idx) => {
      if (idx < index) next.add(idx);
      if (idx > index) next.add(idx - 1);
    });
    this.unlockedIndexes = next;
  }

  cancelDelete() {
    this.confirmingDeleteIndex.set(null);
  }
}
