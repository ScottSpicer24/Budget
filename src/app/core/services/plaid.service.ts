// src/app/core/services/plaid.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PlaidService {
  private http = inject(HttpClient);

  // Replace with your Lambda URL when ready
  private linkTokenUrl = 'YOUR_LAMBDA_URL_HERE';

  async openPlaidLink(): Promise<void> {
    /*const { link_token } = await firstValueFrom(
      this.http.post<{ link_token: string }>(this.linkTokenUrl, {})
    );*/
    const link_token = ""

    return new Promise((resolve, reject) => {
      const handler = window.Plaid.create({
        token: link_token,
        onSuccess: (public_token, metadata) => {
          console.log('Public token:', public_token);
          console.log('Metadata:', metadata);
          // TODO: Send public_token to your exchange Lambda here
          handler.destroy();
          resolve();
        },
        onExit: (err, metadata) => {
          console.log('Plaid onExit:', { err, metadata });
          if (err) reject(err);
          else resolve();
          handler.destroy();
        },
      });

      handler.open();
    });
  }
}
