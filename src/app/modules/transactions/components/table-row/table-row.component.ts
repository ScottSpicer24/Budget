import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { Transaction } from 'src/app/shared/models/budget';

@Component({
  selector: '[app-table-row]',
  imports: [FormsModule, AngularSvgIconModule],
  templateUrl: './table-row.component.html',
})
export class TableRowComponent {
  @Input() item: Transaction = <Transaction>{};

  constructor() {}
}
