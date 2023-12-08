import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';

import { AccountService } from 'src/app/_services';

@Component({ templateUrl: 'list.component.html' })
export class ListComponent implements OnInit {
    expenses?: any[];

    constructor(private accountService: AccountService) {}

    ngOnInit() {
        this.accountService.getAllExpenses()
            .pipe(first())
            .subscribe(expenses => this.expenses = expenses);
    }

    deleteExpense(id: string) {
        const expense = this.expenses!.find(x => x.id === id);
        expense.isDeleting = true;
        this.accountService.deleteExpense(id)
            .pipe(first())
            .subscribe(() => this.expenses = this.expenses!.filter(x => x.id !== id));
    }
}
