import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SpendingCategory, Transaction } from 'src/app/shared/models/budget';
import { AngularSvgIconModule } from "angular-svg-icon";

@Component({
  selector: 'app-category-card',
  imports: [AngularSvgIconModule],
  templateUrl: './category-card.component.html'
})
export class CategoryCardComponent implements OnInit {
  @Input() category!: SpendingCategory;
  @Input() allCategoryNames: string[] = [];
  @Output() reassignTransaction = new EventEmitter<{ transaction: Transaction; newCategoryName: string }>();

  protected readonly MAX_VISIBLE: number = 3;
  protected showAll: boolean = false;
  protected tooManyTransactions: boolean = false;
  protected openDropdownId: number | null = null;

  // Getter variable to calc precent pbar is filled
  get progressPercent(): number {
    return Math.min((this.category.totalSpent / this.category.expense.amount) * 100, 100);
  }

  // Getter variable to get all the categories, filtering out the current one
  get otherCategoryNames(): string[] {
    return this.allCategoryNames.filter(name => name !== this.category.expense.name);
  }

  // Change whether you are showing all of the transactions
  protected flipShowAll(): void {
    this.showAll = !this.showAll;
  }

  // Runs on click of circle-arrows icon, opens msnu of other categories
  toggleDropdown(id: number): void {
    this.openDropdownId = this.openDropdownId === id ? null : id;
  }

  // Runs on click of one of the other categories from menu
  // Emits the output to call function assigned in spending.html (handleReassign)
  onReassign(transaction: Transaction, categoryName: string): void {
    this.openDropdownId = null;
    this.reassignTransaction.emit({ transaction, newCategoryName: categoryName });
  }

  // On init decide if you need the transaction extendo button
  ngOnInit() {
    if (this.category.transactions.length > this.MAX_VISIBLE) {
      this.tooManyTransactions = true;
    }
  }
}
