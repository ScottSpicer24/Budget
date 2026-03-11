import { enableProdMode, importProvidersFrom, inject, provideAppInitializer } from '@angular/core';
import { provideAuth, OidcSecurityService } from 'angular-auth-oidc-client';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { BrowserModule, bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app/app-routing.module';
import { AppComponent } from './app/app.component';
import { env } from './environments/environment';
import { provideZonelessChangeDetection } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { authTokenInterceptor } from './app/core/interceptor/auth.interceptor';

if (env.production) {
  enableProdMode();
  //show this warning only on prod mode
  if (window) {
    selfXSSWarning();
  }
}

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(BrowserModule, AppRoutingModule),
    provideAnimations(),
    provideZonelessChangeDetection(),
    // Ensure the HttpClient's used in the app use the auth interceptor to attach Authorization: Bearer <token> to the proper REST API calls
    provideHttpClient(
      withInterceptors([authTokenInterceptor])
    ),
    provideAuth({
      config: {
        authority: 'https://cognito-idp.us-east-1.amazonaws.com/us-east-1_G5bThHJHK',
        redirectUrl: env.hostURL,
        postLogoutRedirectUri: env.hostURL,
        clientId: '303s891u1rbh215qo7q7nilp82',
        scope: 'phone openid email',
        responseType: 'code',
        silentRenew: true,
        useRefreshToken: true,
        // The secureRoutes array is a prefix match — any request whose URL starts with one of those strings will have the token attached automatically.
        secureRoutes: ['https://l53q3cn1hh.execute-api.us-east-1.amazonaws.com'],
      },
    }),
    provideAppInitializer(() => firstValueFrom(inject(OidcSecurityService).checkAuth()))
  ],
}).catch((err) => console.error(err));

function selfXSSWarning() {
  setTimeout(() => {
    console.log(
      '%c** STOP **',
      'font-weight:bold; font: 2.5em Arial; color: white; background-color: #e11d48; padding-left: 15px; padding-right: 15px; border-radius: 25px; padding-top: 5px; padding-bottom: 5px;',
    );
    console.log(
      `\n%cThis is a browser feature intended for developers. Using this console may allow attackers to impersonate you and steal your information using an attack called Self-XSS. Do not enter or paste code that you do not understand.`,
      'font-weight:bold; font: 2em Arial; color: #e11d48;',
    );
  });
}


