import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { Router } from '@angular/router';

import { AccountService } from 'src/app/_services';

@Component({ templateUrl: 'list.component.html' })
export class ListComponent implements OnInit {
    expenses?: any[];

    constructor(private accountService: AccountService,private router: Router) {}

    ngOnInit() {
        this.accountService.getAllExpenses()
            .pipe(first())
            .subscribe(expenses => this.expenses = expenses);
    }

    deleteExpense(id: string) {
        const expense = this.expenses!.find(x => x.ExpenseID === id);
       // expense.isDeleting = true;
        this.accountService.deleteExpense(id)
            .pipe(first())
            .subscribe(() => this.expenses = this.expenses!.filter(x => x.ExpenseID !== id));
    }
}
