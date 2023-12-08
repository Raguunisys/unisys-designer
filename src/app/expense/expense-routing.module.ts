import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LayoutComponent } from './layout.component';
import { ListComponent } from './list.component';
import { AddEditExpenseComponent } from './add-edit-expense.component';
import { DahboardComponent } from './dashboard.component';

const routes: Routes = [
    {
        path: '', component: LayoutComponent,
        children: [
            { path: '', component: ListComponent },
            { path: 'add', component: AddEditExpenseComponent },
            { path: 'edit/:id', component: AddEditExpenseComponent },
            {path:'dashboard',component:DahboardComponent}
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ExpenseRoutingModule{ }
