import { Component } from '@angular/core';
import { Transaction } from '../../../../../shared/models/budget';
import data from '../../../../../../assets/data/transactions.json'

@Component({
  selector: 'app-transactions-card',
  imports: [],
  templateUrl: './transactions-card.component.html',
})
export class TransactionsCardComponent {
  transactions: Transaction[] = [];

  constructor() {
    this.transactions = data;
  }
}
