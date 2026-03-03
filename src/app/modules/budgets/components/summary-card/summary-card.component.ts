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

  private readonly NEEDS_PALETTE = ['#3b82f6', '#2563eb', '#60a5fa', '#1d4ed8', '#93c5fd'];
  private readonly WANTS_PALETTE = ['#a855f7', '#9333ea', '#c084fc', '#7c3aed', '#d8b4fe'];
  private readonly DEBTS_PALETTE = ['#ef4444', '#dc2626', '#f87171', '#b91c1c', '#fca5a5'];

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
        pie: { donut: { size: '65%' } },
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
