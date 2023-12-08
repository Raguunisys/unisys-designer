import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AccountService, AlertService } from 'src/app/_services';

@Component({ templateUrl: 'add-edit-expense.component.html' })
export class AddEditExpenseComponent implements OnInit {
    form!: FormGroup;
    id?: string;
    title!: string;
    loading = false;
    submitting = false;
    submitted = false;

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private accountService: AccountService,
        private alertService: AlertService
    ) { }

    ngOnInit() {
        this.id = this.route.snapshot.params['id'];

        // form with validation rules
        this.form = this.formBuilder.group({
            name: ['', Validators.required],
            amount: ['', Validators.required],
            category: ['', Validators.required],
            date: ['', Validators.required],
            userId:[this.accountService.userValue?.id]
        });

        this.title = 'Add Expense';
        if (this.id) {
            // edit mode
            this.title = 'Edit Expense';
            this.loading = true;
            this.accountService.getExpenseById(this.id)
                .pipe(first())
                .subscribe(x => {
                    this.form.patchValue(x);
                    this.loading = false;
                });
        }
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

        this.submitting = true;
        this.saveExpense()
            .pipe(first())
            .subscribe({
                next: () => {
                    this.alertService.success('Expense saved', { keepAfterRouteChange: true });
                    this.router.navigateByUrl('/expenses');
                },
                error: error => {
                    this.alertService.error(error);
                    this.submitting = false;
                }
            })
    }

    private saveExpense() {
        // create or update user based on id param
        return this.id
            ? this.accountService.updateExpense(this.id!, this.form.value)
            : this.accountService.insertExpense(this.form.value);
    }
}
