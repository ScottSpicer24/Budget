import { Component } from '@angular/core';
import budgetsData from '../../../../../../assets/data/budgets.json';
import transactionsData from '../../../../../../assets/data/transactions.json';
import { Budget, Transaction } from '../../../../../shared/models/budget';

type BudgetRow = {
  category: string;
  budget: number;
  spent: number;
  percent: number; // 0-1, capped at 1
  over: boolean;
};

@Component({
  selector: 'app-budgets-card',
  imports: [],
  templateUrl: './budgets-card.component.html',
})
export class BudgetsCardComponent {
  rows: BudgetRow[] = [];

  constructor() {
    // Take budgets.json and map them to a list of type Budget
    const budgets = (budgetsData as Budget[]).filter((b) => b.Category !== 'Income');
    const transactions = transactionsData as Transaction[];

    // map of category --> spending
    const spendingByCategory = new Map<string, number>();

    // iterate through transactions and add to spendingByCategory
    for (const tx of transactions) {
      // skip income
      if (!tx.type || tx.type === 'Income') {
        continue;
      }
      if (tx.amount >= 0) {
        continue;
      }

      // add to spendingByCategory
      const category = tx.type;
      const current = spendingByCategory.get(category) ?? 0; // if null or undef set to 0
      spendingByCategory.set(category, current + Math.abs(tx.amount));
    }

    // map each budget (this is each category from the json) + spendingByCategory --> rows (BudgetRow)
    // i.e. for each category, save the name, allocated amount, spent amount, percentage spent
    this.rows = budgets.map((b) => {
      const spent = spendingByCategory.get(b.Category) ?? 0;
      const budget = b.Amount;
      const ratio = budget > 0 ? spent / budget : 0;
      const percent = Math.min(ratio, 1);

      return {
        category: b.Category,
        budget,
        spent,
        percent,
        over: spent > budget,
      };
    });
  }
}
