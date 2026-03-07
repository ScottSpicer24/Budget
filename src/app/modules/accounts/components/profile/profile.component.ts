import { Component } from '@angular/core';
import { AngularSvgIconModule } from 'angular-svg-icon';
import profileData from '../../../../../assets/data/profile.json'
import { Profile} from 'src/app/shared/models/budget';

@Component({
  selector: 'app-profile',
  imports: [AngularSvgIconModule],
  templateUrl: './profile.component.html'
})
export class ProfileComponent {
  protected profile : Profile = profileData
  protected showPassword = false;

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  formatPhoneNumber(phone: string): string {
    const digits = phone.replace(/\D/g, '');
    if (digits.length === 10) {
      return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
    }
    return phone;
  }

}
