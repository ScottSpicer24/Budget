import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NgxSonnerToaster } from 'ngx-sonner';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { ThemeService } from './core/services/theme.service';
import { ResponsiveHelperComponent } from './shared/components/responsive-helper/responsive-helper.component';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [RouterOutlet, ResponsiveHelperComponent, NgxSonnerToaster],
})
export class AppComponent implements OnInit {
  title = 'Angular Tailwind';

  constructor(
    public themeService: ThemeService,
    private readonly oidc: OidcSecurityService,
  ) {}

  ngOnInit(): void {
    this.oidc.checkAuth().subscribe();
  }
}
