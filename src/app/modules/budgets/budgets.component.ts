import { Component } from '@angular/core';
import { ExpenseCardComponent } from './components/expense-card/expense-card.component';
import { HeaderComponent } from './components/header/header.component';
import { SummaryCardComponent } from './components/summary-card/summary-card.component';
import { IncomeCardComponent } from './components/income-card/income-card.component';

@Component({
  selector: 'app-budgets',
  imports: [HeaderComponent, SummaryCardComponent, IncomeCardComponent, ExpenseCardComponent  ],
  templateUrl: './budgets.component.html',
})
export class BudgetsComponent {

}
