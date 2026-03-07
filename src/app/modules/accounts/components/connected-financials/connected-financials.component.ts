import { Component } from '@angular/core';
import accountsData from '../../../../../assets/data/accounts.json'
import { Account } from 'src/app/shared/models/budget';



@Component({
  selector: 'app-connected-financials',
  imports: [],
  templateUrl: './connected-financials.component.html'
})
export class ConnectedFinancialsComponent {
  protected accounts: Account[] = accountsData
}
