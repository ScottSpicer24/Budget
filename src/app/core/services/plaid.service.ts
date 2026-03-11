// src/app/core/services/plaid.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { env } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class PlaidService {
  private http = inject(HttpClient);

  // Lambda URL
  private lambdaPath = '/plaidLink'
  private lambda = env.lambdaURL.concat(this.lambdaPath)

  async openPlaidLink(): Promise<void> {
    console.log("Getting Link Token")
    const { link_token } = await firstValueFrom(
      this.http.get<{ link_token: string }>(this.lambda, {})
    );
    console.log("Finished getting Link Token")
    console.log(link_token)

    return new Promise((resolve, reject) => {
      const handler = window.Plaid.create({
        token: link_token,
        onSuccess: async (public_token, metadata) => {
          try {
            console.log('Public token:', public_token);
            console.log('Metadata:', metadata);

            const payload = { public_token };
            const resp = await firstValueFrom(this.http.post(this.lambda, payload));
            console.log(`response: ${JSON.stringify(resp)}`);

            handler.destroy();
            resolve();
          }
          catch (err) {
            handler.destroy();
            reject(err);  // now the outer Promise properly rejects on failure
          }
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
