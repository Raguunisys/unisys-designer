import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { ExpenseRoutingModule } from './expense-routing.module';
import { LayoutComponent } from './layout.component';
import { ListComponent } from './list.component';
import { AddEditExpenseComponent } from './add-edit-expense.component';
import { DahboardComponent } from './dashboard.component';


@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        ExpenseRoutingModule
    ],
    declarations: [
        LayoutComponent,
        ListComponent,
        AddEditExpenseComponent,
        DahboardComponent
    ]
})
export class ExpenseModule { }
