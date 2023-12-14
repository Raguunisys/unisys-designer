import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AccountService } from 'src/app/_services';

@Component({ templateUrl: 'layout.component.html' })
export class LayoutComponent {
  constructor(private accountService: AccountService,private router: Router){

  }
  logout(){
    this.accountService.logout();
    this.router.navigate(['index/login']);

}
 }
