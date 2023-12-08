import { Component, OnInit } from '@angular/core';
import Chart from 'chart.js/auto';
import { first } from 'rxjs';
import { AccountService } from 'src/app/_services';
import { Expense } from '../_models';

@Component({ templateUrl: 'dashboard.component.html' })

export class DahboardComponent implements OnInit {
  barChart: any;
  pieChart:any;
  chartData?:any[];
  expensesSummaryDate: Map<string, number> = new Map();
  expensesSummaryCategory: Map<string, number> = new Map();
  monthlyExpensesdata: { [key: string]: number } = {};
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
              this.sortMonthlyExpensesByMonth();
              this.sortExpensesByDate();
              this.createLineChart();
              this.createPieChart();
              this.createBarChart();

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
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)'
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)'
          ],
          borderWidth: 1
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
          label: 'Daily Expenses',
          data: this.categoryTotals, //this.chartData?.map(expense=>expense.amount),
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)'
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)'
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
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)'
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)'
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
      const date = expense.date;
      const amount = expense.amount;
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
    this.categories = [...new Set(this.chartData?.map(expense => expense.category))];
   this.categoryTotals = this.categories.map(category =>
      this.chartData?.filter(expense => expense.category === category)
        .reduce((total, expense) => total + expense.amount, 0)
    );
  }

  getMonthlyTotalExpenses():void {
    const monthlyExpenses: { [key: string]: number } = {};

    this.chartData?.forEach(expense => {
      const expenseDate = new Date(expense.date);
      const yearMonth = `${expenseDate.getFullYear()}-${('0' + (expenseDate.getMonth() + 1)).slice(-2)}`;

      if (monthlyExpenses[yearMonth]) {
        monthlyExpenses[yearMonth] += expense.amount;
      } else {
        monthlyExpenses[yearMonth] = expense.amount;
      }
    });

    const monthlyTotals = Object.keys(monthlyExpenses).map(month => ({
      month,
      total: monthlyExpenses[month]
    }));

    this.monthlyExpensesdata=monthlyExpenses;
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
