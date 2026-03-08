import { Component } from '@angular/core';
import { BudgetHeaderComponent } from '../../components/budget-header/budget-header.component';
import data from '../../../../../assets/data/accounts.json';
import { Account } from '../../../../shared/models/budget';
import { BalanceCardComponent } from '../../components/balance-card/balance-card.component';
import { TransactionsCardComponent } from '../../components/transactions-card/transactions-card.component';
import { BudgetsCardComponent } from '../../components/budgets-card/budgets-card.component';
import { SpendingCardComponent } from '../../components/spending-card/spending-card.component';


@Component({
  selector: 'app-budget',
  imports: [BudgetHeaderComponent, BalanceCardComponent, TransactionsCardComponent, BudgetsCardComponent, SpendingCardComponent],
  templateUrl: './budget.component.html',
})
export class BudgetComponent {
  accounts: Account[] = data;
}
