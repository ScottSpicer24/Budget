import { Component } from '@angular/core';
import { HeaderComponent } from './components/header/header.component';
import { CategoryCardComponent } from './components/category-card/category-card.component';
import { SummaryCardComponent } from './components/summary-card/summary-card.component';
import transactionsData from '../../../assets/data/transactions.json';
import budgetPlanData from '../../../assets/data/budget-plan.json';
import { BudgetPlan, Transaction, SpendingCategory } from '../../shared/models/budget';

@Component({
  selector: 'app-spending',
  imports: [HeaderComponent, CategoryCardComponent, SummaryCardComponent],
  templateUrl: './spending.component.html'
})
export class SpendingComponent {
  spendingCategories: SpendingCategory[] = [];

  // Create the spending categories
  constructor() {
    const budgetPlan = budgetPlanData as BudgetPlan;
    const transactions = transactionsData as Transaction[];

    this.spendingCategories = budgetPlan.espense.map((expense) => {
      // Filter cuts the array down based on a filter function shown
      const transactionsArray = transactions.filter((transaction) => transaction.type === expense.name)
      // reduce collapses an array into a single number. --> (accumulator variable, and current value) => function, starting point
      const totalSpentAmnt = (transactionsArray.reduce((acc, sum) => acc + sum.amount, 0)) * -1
      const isOver = totalSpentAmnt >= expense.amount

      return  {
        expense,
        transactions: transactionsArray,
        totalSpent: totalSpentAmnt,
        over: isOver
      }
    });
  }

  // create an array of all the category names
  get allCategoryNames(): string[] {
    return this.spendingCategories.map(cat => cat.expense.name);
  }

  // Emitted from output, changes spending category
  handleReassign(event: { transaction: Transaction; newCategoryName: string }): void {
    const { transaction, newCategoryName } = event;

    // Remove transaction from curr location
    // Add it transaction to new location
    this.spendingCategories = this.spendingCategories.map(cat => {
      const hasTransaction = cat.transactions.some(t => t.id === transaction.id);
      const isDestination = cat.expense.name === newCategoryName;

      // remove from curr
      if (hasTransaction) {
        const updated = cat.transactions.filter(t => t.id !== transaction.id);
        const totalSpent = updated.reduce((acc, t) => acc + t.amount, 0) * -1;
        // ... makes a new copy of cat, then overrides the next components in the list
        return { ...cat, transactions: updated, totalSpent, over: totalSpent >= cat.expense.amount };
      }

      // add to new location
      if (isDestination) {
        const updated = [...cat.transactions, { ...transaction, type: newCategoryName }];
        const totalSpent = updated.reduce((acc, t) => acc + t.amount, 0) * -1;
        return { ...cat, transactions: updated, totalSpent, over: totalSpent >= cat.expense.amount };
      }

      return cat;
    });
  }
}
