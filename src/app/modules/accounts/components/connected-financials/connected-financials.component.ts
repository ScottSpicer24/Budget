import { Component, inject } from '@angular/core';
import accountsData from '../../../../../assets/data/accounts.json'
import { Account } from 'src/app/shared/models/budget';
import { PlaidService } from 'src/app/core/services/plaid.service';



@Component({
  selector: 'app-connected-financials',
  imports: [],
  templateUrl: './connected-financials.component.html'
})
export class ConnectedFinancialsComponent {
  protected accounts: Account[] = accountsData
  private plaid = inject(PlaidService)

  async addAccount() {
    console.log("Adding Bank Account.")
    await this.plaid.openPlaidLink();
    // After success, refresh your accounts list
  }
}
