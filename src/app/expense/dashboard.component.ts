import { Component, OnInit } from '@angular/core';
import Chart from 'chart.js/auto';
import { first } from 'rxjs';
import { AccountService } from 'src/app/_services';
import { Expense } from '../_models';

@Component({ templateUrl: 'dashboard.component.html' })

export class DahboardComponent implements OnInit {
  barChart: any;
  pieChart:any;
  doughnutChart:any;
  chartData?:any[];
  expensesSummaryDate: Map<string, number> = new Map();
  expensesSummaryCategory: Map<string, number> = new Map();
  monthlyExpensesdata: { [key: string]: number } = {};
 // weeklyExpensesData:{ [key: string]: number } = {};
  weeklyExpensesData: { [key: string]: number } = {};
  constructor(private accountService:AccountService){
  }
  ngOnInit() {
    this.accountService.getAllExpenses()
            .pipe(first())
            .subscribe(expenses => {
              this.chartData = expenses;
              this.calculateExpensesSummary();
              this.getCategoryTotal();
              this.getMonthlyTotalExpenses();
              this.getWeeklyExpenses();
              this.sortMonthlyExpensesByMonth();
              this.sortExpensesByDate();
              this.createLineChart();
              this.createPieChart();
              this.createBarChart();
              this.createDoughnutChart();

            });

  }
  createLineChart() {
    const ctx = document.getElementById('LineChart') as HTMLCanvasElement;
    this.barChart = new Chart(ctx, {
      type: 'line', // Choose the type of chart you want (bar, line, pie, etc.)
      data: {
        labels: Array.from(this.expensesSummaryDate.keys()), //this.chartData?.map(expense=>expense.date),
        datasets: [{
          label: 'Daily Expenses',
          data: Array.from(this.expensesSummaryDate.values()), //this.chartData?.map(expense=>expense.amount),
          borderColor: [
            'rgb(0, 102, 102)'
          ],
          borderWidth: 3,
          tension: 0.1
        }]
      },
      options: {
        // Additional options here
      }
    });
  }

  createPieChart() {
    const ctx = document.getElementById('PieChart') as HTMLCanvasElement;
    this.pieChart = new Chart(ctx, {
      type: 'pie', // Choose the type of chart you want (bar, line, pie, etc.)
      data: {
        labels: this.categories, //this.chartData?.map(expense=>expense.date),
        datasets: [{
          label: 'Category Expenses',
          data: this.categoryTotals, //this.chartData?.map(expense=>expense.amount),
          backgroundColor: [
            'RGB(0, 77, 77)',
            'RGB(0, 127, 127)',
            'rgb(0, 204, 153)',
            'rgb(51, 153, 102)',
            'RGB(0, 255, 255)',
            'RGB(0, 255, 255)'
          ],
          borderColor: [
            'RGB(0, 77, 77)',
            'RGB(0, 127, 127)',
            'rgb(0, 204, 153)',
            'rgb(51, 153, 102)',
            'RGB(0, 255, 255)',
            'RGB(0, 255, 255)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        // Additional options here
      }
    });
  }

  createDoughnutChart() {
    const ctx = document.getElementById('doughnut') as HTMLCanvasElement;
    this.doughnutChart = new Chart(ctx, {
      type: 'bar', // Choose the type of chart you want (bar, line, pie, etc.)
      data: {
        labels: Object.keys(this.weeklyExpensesData), //this.chartData?.map(expense=>expense.date),
        datasets: [{
          label: 'Weely Expenses',
          data: Object.values(this.weeklyExpensesData), //this.chartData?.map(expense=>expense.amount),
          backgroundColor: [
            'RGB(0, 77, 77)',
            'RGB(0, 127, 127)',
            'rgb(0, 204, 153)',
            'rgb(51, 153, 102)',
            'RGB(0, 255, 255)',
            'RGB(0, 255, 255)'
          ],
          borderColor: [
            'RGB(0, 77, 77)',
            'RGB(0, 127, 127)',
            'rgb(0, 204, 153)',
            'rgb(51, 153, 102)',
            'RGB(0, 255, 255)',
            'RGB(0, 255, 255)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        // Additional options here
      }
    });
  }

  createBarChart() {
    const ctx = document.getElementById('BarChart') as HTMLCanvasElement;
    this.pieChart = new Chart(ctx, {
      type: 'bar', // Choose the type of chart you want (bar, line, pie, etc.)
      data: {
        labels: Object.keys(this.monthlyExpensesdata), //this.chartData?.map(expense=>expense.date),
        datasets: [{
          label: 'Monthly Expenses',
          data: Object.values(this.monthlyExpensesdata), //this.chartData?.map(expense=>expense.amount),
          backgroundColor: [
            'RGB(0, 77, 77)',
            'RGB(0, 127, 127)',
            'rgb(0, 204, 153)',
            'rgb(0, 153, 153)',
            'RGB(0, 255, 255)',
            'RGB(0, 255, 255)'
          ],
          borderColor: [
            'RGB(0, 77, 77)',
            'RGB(0, 127, 127)',
            'rgb(0, 204, 153)',
            'RGB(128, 0, 0)',
            'RGB(0, 255, 255)',
            'RGB(0, 255, 255)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        // Additional options here
      }
    });
  }

  calculateExpensesSummary(): void {
    this.chartData?.forEach(expense => {
      const date = expense.Date;
      const amount = expense.ProductCost;
      if (this.expensesSummaryDate.has(date)) {
        const totalAmount = this.expensesSummaryDate.get(date) || 0;
        this.expensesSummaryDate.set(date, totalAmount + amount);
      } else {
        this.expensesSummaryDate.set(date, amount);
      }
    });
  }
  categories?:any[];
  categoryTotals?:any[];
  getCategoryTotal(): void {
    this.categories = [...new Set(this.chartData?.map(expense => expense.ProductCatogary))];
   this.categoryTotals = this.categories.map(category =>
      this.chartData?.filter(expense => expense.ProductCatogary === category)
        .reduce((total, expense) => total + expense.ProductCost, 0)
    );
  }

  getMonthlyTotalExpenses():void {
    const monthlyExpenses: { [key: string]: number } = {};

    this.chartData?.forEach(expense => {
      const expenseDate = new Date(expense.Date);
      const yearMonth = `${expenseDate.getFullYear()}-${('0' + (expenseDate.getMonth() + 1)).slice(-2)}`;

      if (monthlyExpenses[yearMonth]) {
        monthlyExpenses[yearMonth] += expense.ProductCost;
      } else {
        monthlyExpenses[yearMonth] = expense.ProductCost;
      }
    });

    const monthlyTotals = Object.keys(monthlyExpenses).map(month => ({
      month,
      total: monthlyExpenses[month]
    }));

    this.monthlyExpensesdata=monthlyExpenses;
  }

  getWeeklyExpenses(): void {
    const weeklyExpenses: { [key: string]: number } = {};

    this.chartData?.forEach(expense => {
      const expenseDate = new Date(expense.Date);
      const weekNumber = this.getWeekNumber(expenseDate);
      const yearWeek = `${expenseDate.getFullYear()}-W${('0' + weekNumber).slice(-2)}`;

      if (weeklyExpenses[yearWeek]) {
        weeklyExpenses[yearWeek] += expense.ProductCost;
      } else {
        weeklyExpenses[yearWeek] = expense.ProductCost;
      }
    });

    this.weeklyExpensesData = weeklyExpenses; // Assigning weeklyExpenses directly to this.weeklyExpensesData
  }

  // Function to get the week number of a date
  getWeekNumber(date: Date): number {
    const oneJan = new Date(date.getFullYear(), 0, 1);
    const millisecondsInDay = 86400000;
    return Math.ceil(((date.getTime() - oneJan.getTime()) / millisecondsInDay + oneJan.getDay() + 1) / 7);
  }


  sortExpensesByDate(): void {
    if (this.expensesSummaryDate) {
      const sortedExpenses = new Map<string, number>(
        [...this.expensesSummaryDate.entries()].sort((a, b) => {
          // Convert date strings to Date objects for comparison
          const dateA = new Date(a[0]);
          const dateB = new Date(b[0]);

          return dateA.getTime() - dateB.getTime();
        })
      );

      // Replace the original expensesSummaryDate Map with the sorted Map
      this.expensesSummaryDate = sortedExpenses;
    }
  }

  sortMonthlyExpensesByMonth(): void {
    const sortedEntries = Object.entries(this.monthlyExpensesdata)
      .sort((a, b) => {
        const dateA = new Date(a[0]);
        const dateB = new Date(b[0]);

        return dateA.getTime() - dateB.getTime();
      });

    this.monthlyExpensesdata = Object.fromEntries(sortedEntries);
  }
}
