import { Component } from '@angular/core';
import { BudgetPlanService } from '../../core/services/budget-plan.service';
import { ExpenseCardComponent } from './components/expense-card/expense-card.component';
import { HeaderComponent } from './components/header/header.component';
import { SummaryCardComponent } from './components/summary-card/summary-card.component';
import { IncomeCardComponent } from './components/income-card/income-card.component';
import { SavingsCardComponent } from "./components/savings-card/savings-card.component";

@Component({
  selector: 'app-budgets',
  imports: [HeaderComponent, SummaryCardComponent, IncomeCardComponent, ExpenseCardComponent, SavingsCardComponent],
  providers: [BudgetPlanService],
  templateUrl: './budgets.component.html',
})
export class BudgetsComponent {}
