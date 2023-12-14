import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './home';
import { AuthGuard } from './_helpers';

const indexModule = () => import('./index/index.module').then(x => x.IndexModule);
const usersModule = () => import('./users/users.module').then(x => x.UsersModule);
const expenseModule = () => import('./expense/expense.module').then(x => x.ExpenseModule);

const routes: Routes = [
  { path: '',  loadChildren: indexModule },
  { path: 'users', loadChildren: usersModule, canActivate: [AuthGuard] },
  { path: 'expenses', loadChildren: expenseModule, canActivate: [AuthGuard] },
  { path: 'index', loadChildren: indexModule },

  // otherwise redirect to home
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
