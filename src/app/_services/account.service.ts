import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import {environment} from 'src/environments/environment';
import { User,Expense } from 'src/app/_models';

@Injectable({ providedIn: 'root' })
export class AccountService {
    private userSubject: BehaviorSubject<User | null>;
    public user: Observable<User | null>;

    constructor(
        private router: Router,
        private http: HttpClient
    ) {
        this.userSubject = new BehaviorSubject(JSON.parse(localStorage.getItem('user')!));
        this.user = this.userSubject.asObservable();
    }

    public get userValue() {
        return this.userSubject.value;
    }

    login(username: string, password: string) {
        // return this.http.post<User>(`${environment.apiUrl}/users`, { username, password })
        //     .pipe(map(user => {
        //         // store user details and jwt token in local storage to keep user logged in between page refreshes
        //         localStorage.setItem('user', JSON.stringify(user));
        //         this.userSubject.next(user);
        //         return user;
        //     }));
        return this.http.get<User[]>(`${environment.apiUrl}/users?username=`+username).pipe(map(user=>{
          localStorage.setItem('user', JSON.stringify(user[0]));
                  this.userSubject.next(user[0]);
                  return user[0];
        }));
    }

    logout() {
        // remove user from local storage and set current user to null
        localStorage.removeItem('user');
        this.userSubject.next(null);
        this.router.navigate(['/account/login']);
    }

    register(user: User) {
        return this.http.post(`${environment.apiUrl}/users`, user);
    }

    getAll() {
        return this.http.get<User[]>(`${environment.apiUrl}/users`);
    }

    getById(id: string) {
        return this.http.get<User>(`${environment.apiUrl}/users/${id}`);
    }

    update(id: string, params: any) {
        return this.http.put(`${environment.apiUrl}/users/${id}`, params)
            .pipe(map(x => {
                // update stored user if the logged in user updated their own record
                if (id == this.userValue?.id) {
                    // update local storage
                    const user = { ...this.userValue, ...params };
                    localStorage.setItem('user', JSON.stringify(user));

                    // publish updated user to subscribers
                    this.userSubject.next(user);
                }
                return x;
            }));
    }

    delete(id: string) {
        return this.http.delete(`${environment.apiUrl}/users/${id}`)
            .pipe(map(x => {
                // auto logout if the logged in user deleted their own record
                if (id == this.userValue?.id) {
                    this.logout();
                }
                return x;
            }));
    }


    //Expense API
    getAllExpenses(){
      return this.http.get<Expense[]>(`${environment.apiUrl}/expenses`);
    }

    insertExpense(expense: Expense) {
      return this.http.post(`${environment.apiUrl}/expenses`, expense);
  }

  updateExpense(id: string, params: any){
    return this.http.put(`${environment.apiUrl}/expenses/${id}`, params);
    //return this.http.post(`${environment.apiUrl}/expenses`, expense);
  }

  deleteExpense(id:string){
    return this.http.delete(`${environment.apiUrl}/expenses/${id}`);
  }

  getExpenseById(id: string) {
    return this.http.get<Expense>(`${environment.apiUrl}/expenses/${id}`);
}
}
