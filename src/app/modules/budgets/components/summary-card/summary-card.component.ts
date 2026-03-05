import { CurrencyPipe } from '@angular/common';
import { Component, computed, effect, inject } from '@angular/core';
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
import { BudgetPlanService } from '../../../../core/services/budget-plan.service';
import { ThemeService } from '../../../../core/services/theme.service';

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
  colors: string[];
};

interface SummaryItem {
  name: string;
  amount: number;
  color: string;
}

@Component({
  selector: 'app-summary-card',
  imports: [NgApexchartsModule, CurrencyPipe],
  templateUrl: './summary-card.component.html',
})
export class SummaryCardComponent {
  protected service = inject(BudgetPlanService);
  private themeService = inject(ThemeService);

  protected readonly MAX_VISIBLE = 3;

  private readonly NEEDS_PALETTE = [ // green/tan/brown
    '#295135',
    '#5A6650',
    '#0E402D',
    '#43281C',
    '#48392A',
    '#36453B',
    '#C2C1A5',
    '#447604',
    '#6CC551',
    '#716A5C',
    '#2CF6B3',
    '#A39B8B',
    '#2CF6B3',
    '#CEE397',
    '#56876D',
  ];
  private readonly WANTS_PALETTE = [ // purple/blue
    '#1C6E8C',
    '#274156',
    '#52AD9C',
    '#9FFCDF',
    '#7209B7',
    '#4361EE',
    '#3A0CA3',
    '#4CC9F0',
    '#5DB7DE',
    '#ECB0E1',
    '#9CF6F6',
    '#C9DDFF',
    '#C1AAC0',
    '#031927',
    '#508AA8'
    ];
  private readonly DEBTS_PALETTE = [ // pink/red
    '#A51C30',
    '#F72585',
    '#C46D5E',
    '#DE6C83',
    '#C52233',
    '#820B8A',
    '#580C1F',
    '#AF9AB2',
    '#F56960',
    '#672A4E',
    '#EA9E8D',
    '#A7333F',
    '#D64550',
    '#74121D',
    '#F4E04D',
  ];

  protected needsItems = computed<SummaryItem[]>(() =>
    (this.service.budgetPlan()?.espense.filter((e) => e.need) ?? [])
      .map((e) => ({ name: e.name, amount: e.amount }))
      .sort((a, b) => b.amount - a.amount)
      .map((item, i) => ({ ...item, color: this.NEEDS_PALETTE[i % this.NEEDS_PALETTE.length] })),
  );

  protected wantsItems = computed<SummaryItem[]>(() =>
    (this.service.budgetPlan()?.espense.filter((e) => !e.need) ?? [])
      .map((e) => ({ name: e.name, amount: e.amount }))
      .sort((a, b) => b.amount - a.amount)
      .map((item, i) => ({ ...item, color: this.WANTS_PALETTE[i % this.WANTS_PALETTE.length] })),
  );

  protected debtsItems = computed<SummaryItem[]>(() =>
    (this.service.budgetPlan()?.debts ?? [])
      .map((d) => ({ name: d.name, amount: d.minimumMonthlyPayment }))
      .sort((a, b) => b.amount - a.amount)
      .map((item, i) => ({ ...item, color: this.DEBTS_PALETTE[i % this.DEBTS_PALETTE.length] })),
  );

  protected totalNeeds = computed(() => this.needsItems().reduce((sum, e) => sum + e.amount, 0));
  protected totalWants = computed(() => this.wantsItems().reduce((sum, e) => sum + e.amount, 0));

  protected remaining = computed(
    () => this.service.totalIncome() - this.totalNeeds() - this.totalWants() - this.service.totalDebtPayments(),
  );

  protected hasChartData = computed(() => {
    const allItems = [...this.needsItems(), ...this.wantsItems(), ...this.debtsItems()];
    return allItems.some((i) => i.amount > 0);
  });

  public chartOptions: Partial<DonutChartOptions>;

  constructor() {
    this.chartOptions = this.buildBase(this.toApexMode(this.themeService.theme().mode));

    effect(() => {
      const apexMode = this.toApexMode(this.themeService.theme().mode);
      const allItems = [
        ...this.needsItems(),
        ...this.wantsItems(),
        ...this.debtsItems(),
      ].filter((i) => i.amount > 0);

      this.chartOptions = {
        ...this.chartOptions,
        series: allItems.map((i) => i.amount),
        labels: allItems.map((i) => i.name),
        colors: allItems.map((i) => i.color),
        tooltip: { theme: apexMode },
        theme: { mode: apexMode },
      };
    });
  }

  private buildBase(apexMode: 'dark' | 'light'): Partial<DonutChartOptions> {
    return {
      series: [],
      labels: [],
      colors: [],
      chart: {
        type: 'donut',
        height: 200,
        background: 'transparent',
        toolbar: { show: false },
      },
      plotOptions: {
        pie: { donut: { size: '55%' } },
      },
      dataLabels: { enabled: false },
      legend: { show: false },
      stroke: { width: 0 },
      fill: { opacity: 1 },
      tooltip: { theme: apexMode },
      theme: { mode: apexMode },
      responsive: [{ breakpoint: 480, options: { chart: { height: 160 } } }],
    };
  }

  private toApexMode(mode: string): 'dark' | 'light' {
    return mode === 'dark' ? 'dark' : 'light';
  }
}
