import { CurrencyPipe } from '@angular/common';
import { Component, inject, Input, OnChanges } from '@angular/core';
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
import { ThemeService } from '../../../../core/services/theme.service';
import { SpendingCategory } from '../../../../shared/models/budget';

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

interface CategoryItem {
  name: string;
  totalSpent: number;
  color: string;
}

@Component({
  selector: 'app-summary-card',
  imports: [NgApexchartsModule, CurrencyPipe],
  templateUrl: './summary-card.component.html',
})
export class SummaryCardComponent implements OnChanges {
  @Input() spendingCategories: SpendingCategory[] = [];

  private themeService = inject(ThemeService);

  // Colors chosen so no two adjacent entries are visually similar
  private readonly PALETTE = [
    '#E63946', // red
    '#4361EE', // blue
    '#2DC653', // green
    '#FF9F1C', // orange
    '#7B2D8B', // purple
    '#00B4D8', // cyan
    '#F72585', // pink
    '#80B918', // lime
    '#E9C46A', // yellow
    '#264653', // dark teal
    '#E76F51', // coral
    '#52B788', // sage green
    '#9B5DE5', // violet
    '#00F5D4', // mint
    '#3D405B', // dark blue-grey
  ];

  protected categoryItems: CategoryItem[] = [];
  protected hasChartData = false;
  protected totalSpent: number = 0
  public chartOptions: Partial<DonutChartOptions>;

  constructor() {
    this.chartOptions = this.buildBase(this.toApexMode(this.themeService.theme().mode));
  }

  ngOnChanges(): void {
    this.categoryItems = this.spendingCategories
      .filter(cat => cat.totalSpent > 0)
      .map((cat, i) => ({
        name: cat.expense.name,
        totalSpent: cat.totalSpent,
        color: this.PALETTE[i % this.PALETTE.length],
      }));

    this.totalSpent = this.spendingCategories.reduce((accu, curr) => accu + curr.totalSpent, 0)

    this.hasChartData = this.categoryItems.length > 0;

    const apexMode = this.toApexMode(this.themeService.theme().mode);
    this.chartOptions = {
      ...this.chartOptions,
      series: this.categoryItems.map(i => i.totalSpent),
      labels: this.categoryItems.map(i => i.name),
      colors: this.categoryItems.map(i => i.color),
      tooltip: { theme: apexMode },
      theme: { mode: apexMode },
    };
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
