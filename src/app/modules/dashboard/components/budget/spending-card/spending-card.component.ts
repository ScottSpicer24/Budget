import { Component, effect } from '@angular/core';
import { NgApexchartsModule } from 'ng-apexcharts';
import { ThemeService } from 'src/app/core/services/theme.service';
import { ChartOptions } from '../../../../../shared/models/chart-options';
import transactionsData from '../../../../../../assets/data/transactions.json';
import { Transaction } from '../../../../../shared/models/budget';

@Component({
  selector: 'app-spending-card',
  imports: [NgApexchartsModule],
  templateUrl: './spending-card.component.html',
})
export class SpendingCardComponent {
  public chartOptions: Partial<ChartOptions>;
  public monthLabel = '';
  public monthChangeLabel = '';
  public monthChangePositive = true;

  constructor(private themeService: ThemeService) {
    const transactions = transactionsData as Transaction[];

    let latestDate: Date | null = null;
    for (const tx of transactions) {
      const d = new Date(tx.date);
      if (!latestDate || d > latestDate) {
        latestDate = d;
      }
    }

    if (!latestDate) {
      this.monthLabel = '';
      this.chartOptions = {};
      return;
    }

    const year = latestDate.getFullYear();
    const month = latestDate.getMonth(); // 0-based
    this.monthLabel = latestDate.toLocaleString(undefined, { month: 'long' });

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const data: number[] = [];
    const categories: string[] = [];

    const monthStart = new Date(year, month, 1);
    const startingBalance = transactions
      .filter((tx) => new Date(tx.date) < monthStart)
      .reduce((sum, tx) => sum + tx.amount, 0);

    // Find last day in this month that has any transaction
    let lastDayWithTx = 0;
    for (const tx of transactions) {
      const d = new Date(tx.date);
      if (d.getFullYear() === year && d.getMonth() === month) {
        lastDayWithTx = Math.max(lastDayWithTx, d.getDate());
      }
    }
    const lastDay = lastDayWithTx || daysInMonth;

    let runningBalance = startingBalance;

    for (let day = 1; day <= lastDay; day++) {
      const dailyNet = transactions
        .filter((tx) => {
          const d = new Date(tx.date);
          return d.getFullYear() === year && d.getMonth() === month && d.getDate() === day;
        })
        .reduce((sum, tx) => sum + tx.amount, 0);

      runningBalance += dailyNet;
      data.push(runningBalance);
      categories.push(day.toString());
    }

    const maxAbsDelta =
      data.length === 0
        ? 1
        : data.reduce((max, value) => {
            const delta = Math.abs(value - startingBalance);
            return Math.max(max, delta);
          }, 0);

    const padding = maxAbsDelta === 0 ? 1 : maxAbsDelta * 1.1;
    const yMin = startingBalance - padding;
    const yMax = startingBalance + padding;

    const endBalance = data.length ? data[data.length - 1] : startingBalance;
    const monthChange = endBalance - startingBalance;
    this.monthChangePositive = monthChange >= 0;
    this.monthChangeLabel = monthChange.toFixed(2);

    let baseColor = '#FFFFFF';

    this.chartOptions = {
      series: [
        {
          name: 'Balance',
          data: data,
        },
      ],
      chart: {
        fontFamily: 'inherit',
        type: 'area',
        height: 150,
        toolbar: {
          show: false,
        },
        sparkline: {
          enabled: true,
        },
      },
      dataLabels: {
        enabled: false,
      },
      fill: {
        type: 'gradient',
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.4,
          opacityTo: 0.2,
          stops: [15, 120, 100],
        },
      },
      stroke: {
        curve: 'smooth',
        show: true,
        width: 3,
        colors: [baseColor],
      },
      yaxis: {
        min: yMin,
        max: yMax,
        labels: {
          show: true,
        },
      },
      xaxis: {
        categories: categories,
        labels: {
          show: true,
        },
        crosshairs: {
          position: 'front',
          stroke: {
            color: baseColor,
            width: 1,
            dashArray: 4,
          },
        },
        tooltip: {
          enabled: true,
        },
      },
      tooltip: {
        theme: 'light',
        y: {
          formatter: function (val) {
            return val.toFixed(2);
          },
        },
      },
      colors: [baseColor],
      annotations: {
        yaxis: [
          {
            y: startingBalance,
            borderColor: baseColor,
            strokeDashArray: 4,
            label: {},
          },
        ],
      },
    };

    effect(() => {
      let primaryColor = getComputedStyle(document.documentElement).getPropertyValue('--primary');
      this.chartOptions.tooltip = {
        theme: this.themeService.theme().mode,
      };
      this.chartOptions.colors = [primaryColor];
      this.chartOptions.stroke!.colors = [primaryColor];
      this.chartOptions.xaxis!.crosshairs!.stroke!.color = primaryColor;
      if (!this.chartOptions.annotations) {
        this.chartOptions.annotations = { yaxis: [] };
      }
      if (this.chartOptions.annotations.yaxis && this.chartOptions.annotations.yaxis.length) {
        this.chartOptions.annotations.yaxis[0].borderColor = primaryColor;
      }
    });
  }
}
