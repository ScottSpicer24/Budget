import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { TableFooterComponent } from './components/table-footer/table-footer.component';
import { TableHeaderComponent } from './components/table-header/table-header.component';
import { TableRowComponent } from './components/table-row/table-row.component';
import { TableFilterService } from './services/table-filter.service';
import data from '../../../assets/data/transactions.json';
import { Transaction } from '../../shared/models/budget';

@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [
    AngularSvgIconModule,
    FormsModule,
    TableHeaderComponent,
    TableFooterComponent,
    TableRowComponent,
  ],
  templateUrl: './transactions.component.html',
})
export class TransactionsComponent {
  private transactions = signal<Transaction[]>(data as Transaction[]);

  filteredTransactions = computed(() => {
    const search = this.filterService.searchField().toLowerCase();
    return this.transactions().filter(
      (tx) =>
        !search ||
        tx.item.toLowerCase().includes(search) ||
        (tx.type ?? '').toLowerCase().includes(search) ||
        tx.account.toLowerCase().includes(search),
    );
  });

  constructor(private filterService: TableFilterService) {}

  toggleTransactions(_checked: boolean): void {}
}
