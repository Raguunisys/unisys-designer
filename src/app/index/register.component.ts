import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AccountService, AlertService } from 'src/app/_services';
import { IndexComponent } from './index.component';

@Component({
 // selector: 'app-index',
  templateUrl: './register.component.html'
  //styleUrls: ['./login.component.scss']
})
export class RegisterComponent implements OnInit {
  form!: FormGroup;
  loading = false;
  submitted = false;

  constructor(
      private formBuilder: FormBuilder,
      private route: ActivatedRoute,
      private router: Router,
      private accountService: AccountService,
      private alertService: AlertService,
      private index:IndexComponent
  ) { this.index.IsHome=false}

  ngOnInit() {
      this.form = this.formBuilder.group({
        TxtName: ['', Validators.required],
        TxtEmail: ['', Validators.required],
        TxtPhone: [, [Validators.required,Validators.minLength(10)]],
        TxtPassword: ['', [Validators.required, Validators.minLength(6)]],
        btnAdd:['Add']

      });
  }

  // convenience getter for easy access to form fields
  get f() { return this.form.controls; }

  onSubmit() {
      this.submitted = true;

      // reset alerts on submit
      this.alertService.clear();

      // stop here if form is invalid
      if (this.form.invalid) {
          return;
      }

      this.loading = true;
      console.log(this.form.value);
      this.accountService.register(this.form.value)
          .pipe(first())
          .subscribe({
              next: () => {
                  this.alertService.success('Registration successful', { keepAfterRouteChange: true });
                  this.router.navigate(['../login'], { relativeTo: this.route });
              },
              error: error => {
                  this.alertService.error(error);
                  this.loading = false;
              }
          });
  }
}
