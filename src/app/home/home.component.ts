﻿import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { User } from 'src/app/_models';
import { AccountService } from 'src/app/_services';

@Component({ templateUrl: 'home.component.html' })
export class HomeComponent {
    user: User | null;

    constructor(private accountService: AccountService,private router: Router) {
        this.user = this.accountService.userValue;
    }

    logout(){
      this.accountService.logout();
      this.router.navigate(['index']);

  }
}
