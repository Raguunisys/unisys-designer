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

    public get email(){
      return localStorage.getItem('email');
    }

    login(email: string, password: string) {
        // return this.http.post<User>(`${environment.apiUrl}/users`, { username, password })
        //     .pipe(map(user => {
        //         // store user details and jwt token in local storage to keep user logged in between page refreshes
        //         localStorage.setItem('user', JSON.stringify(user));
        //         this.userSubject.next(user);
        //         return user;
        //     }));
        return this.http.get(`${environment.apiUrl}/LGNFR/Login?email=`+email+`&password=`+password).pipe(map(user=>{
          console.log(user);
          if(user=="UserValidated"){
            localStorage.setItem('email', email);
              return email;
          }
          return "user is not valid";
                //  this.userSubject.next(user[0]);

        }));
    }

    logout() {
        // remove user from local storage and set current user to null
        localStorage.removeItem('email');
        this.userSubject.next(null);
        this.router.navigate(['/account/login']);
    }
    register(user: User) {
        return this.http.post(`${environment.apiUrl}/USRFR/USRFR`, user);
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
      return this.http.get<Expense[]>(`${environment.apiUrl}/EXPNS/GetExpense?email=${this.email}`);
    }

    insertExpense(expense: Expense) {
      return this.http.post(`${environment.apiUrl}/EXPNS/AddExpense`, expense);
  }

  updateExpense(params: any){
    return this.http.post(`${environment.apiUrl}/EXPNS/UpdateExpense`, params);
    //return this.http.post(`${environment.apiUrl}/expenses`, expense);
  }

  deleteExpense(id:string){
    console.log(id);
    return this.http.get(`${environment.apiUrl}/EXPNS/DeleteExpense?ExpenseID=${id}&Email=${this.email}`);
  }

  getExpenseById(id: string) {
    return this.http.get<Expense>(`${environment.apiUrl}/EXPNS/GetExpenseByID?ExpenseID=${id}&Email=${this.email}`);
}
}
