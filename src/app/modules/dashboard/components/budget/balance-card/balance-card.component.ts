import { Component, Input, effect } from '@angular/core';
import { Account } from '../../../models/budget';
import {
  ApexChart,
  ApexDataLabels,
  ApexFill,
  ApexLegend,
  ApexNonAxisChartSeries,
  ApexPlotOptions,
  ApexResponsive,
  ApexStroke,
  ApexTheme,
  ApexTooltip,
  NgApexchartsModule,
} from 'ng-apexcharts';
import { ThemeService } from 'src/app/core/services/theme.service';

type DonutChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  labels: string[];
  dataLabels: ApexDataLabels;
  legend: ApexLegend;
  plotOptions: ApexPlotOptions;
  stroke: ApexStroke;
  fill: ApexFill;
  tooltip: ApexTooltip;
  theme: ApexTheme;
  responsive: ApexResponsive[];
};

@Component({
  selector: 'app-balance-card',
  imports: [NgApexchartsModule],
  templateUrl: './balance-card.component.html',
})
export class BalanceCardComponent {
  balance: number = 0.0;
  public chartOptions: Partial<DonutChartOptions>;

  private _accounts: Account[] = [];

  @Input()
  set accounts(value: Account[]) {
    this._accounts = value ?? [];
    this.recalculate();
  }
  get accounts(): Account[] {
    return this._accounts;
  }

  constructor(private themeService: ThemeService) {
    const apexMode = this.toApexThemeMode(this.themeService.theme().mode);
    this.chartOptions = {
      series: [],
      labels: [],
      chart: {
        type: 'donut',
        height: 220,
        width: 220,
        background: 'transparent',
        toolbar: { show: false },
      },
      plotOptions: {
        pie: {
          donut: {
            size: '70%',
          },
        },
      },
      dataLabels: { enabled: false },
      legend: { show: true, position: 'bottom' },
      stroke: { width: 0 },
      fill: { opacity: 1 },
      tooltip: { theme: apexMode },
      theme: { mode: apexMode },
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: { width: 200 },
            legend: { position: 'bottom' },
          },
        },
      ],
    };

    effect(() => {
      const apexMode = this.toApexThemeMode(this.themeService.theme().mode);
      this.chartOptions = {
        ...this.chartOptions,
        tooltip: { ...(this.chartOptions.tooltip ?? {}), theme: apexMode },
        theme: { ...(this.chartOptions.theme ?? {}), mode: apexMode },
      };
    });
  }

  private toApexThemeMode(mode: string | undefined | null): 'dark' | 'light' {
    return mode === 'dark' ? 'dark' : 'light';
  }

  private recalculate(): void {
    this.balance = this._accounts.reduce((sum, a) => sum + Number(a.balance ?? 0), 0);

    const series: number[] = [];
    const labels: string[] = [];

    for (const account of this._accounts) {
      const value = Number(account.balance ?? 0);
      if (value <= 0) continue;
      series.push(value);
      labels.push(this.accountLabel(account));
    }

    this.chartOptions = {
      ...this.chartOptions,
      series,
      labels,
    };
  }

  private accountLabel(account: Account): string {
    const bank = (account.bank ?? '').trim();
    const type = (account.type ?? '').trim();
    if (bank && type) return `${bank} (${type})`;
    if (bank) return bank;
    if (type) return type;
    return `Account ${account.id}`;
  }
}
