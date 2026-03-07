import { Component } from '@angular/core';
import { HeaderComponent } from "./components/header/header.component";
import { ProfileComponent } from "./components/profile/profile.component";
import { ConnectedFinancialsComponent } from "./components/connected-financials/connected-financials.component";

@Component({
  selector: 'app-accounts',
  imports: [HeaderComponent, ProfileComponent, ConnectedFinancialsComponent],
  templateUrl: './accounts.component.html'
})
export class AccountsComponent {

}
