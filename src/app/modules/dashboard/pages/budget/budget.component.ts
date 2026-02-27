import { Component } from '@angular/core';
import { BudgetHeaderComponent } from '../../components/budget/budget-header/budget-header.component';
import data from '../../../../../assets/data/accounts.json';
import { Account } from '../../models/budget';
import { BalanceCardComponent } from '../../components/budget/balance-card/balance-card.component';
import { TransactionsCardComponent } from '../../components/budget/transactions-card/transactions-card.component';
import { BudgetsCardComponent } from '../../components/budget/budgets-card/budgets-card.component';
import { SpendingCardComponent } from '../../components/budget/spending-card/spending-card.component';


@Component({
  selector: 'app-budget',
  imports: [BudgetHeaderComponent, BalanceCardComponent, TransactionsCardComponent, BudgetsCardComponent, SpendingCardComponent],
  templateUrl: './budget.component.html',
})
export class BudgetComponent {
  accounts: Account[] = data;
}
