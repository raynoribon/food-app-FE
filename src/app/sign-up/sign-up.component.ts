import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmPasswordValidator } from '../_helpers/confirm-password.validator';
import { CustomerAuthenticationService } from '../_auth/customer-authentication.service';
import { SharedService } from '../_services/shared_service/shared.service';
import { ActivatedRoute, Router } from '@angular/router';
declare var $: any;

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css'],
})
export class SignUpComponent implements OnInit {
  registerForm: FormGroup;
  submitted: boolean = false;
  fieldTextType: boolean;
  errorMessage: any;
  successMessage: string; 
  _date = new Date()
  new_date: any
  max_date: string;
  min_date: any


  constructor(
    private fb: FormBuilder,
    private router: Router,
    private sharedService: SharedService,
    private customerAuthService: CustomerAuthenticationService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {

 



    this.registerForm = this.fb.group(
      {
        fname: [null, Validators.required],
        uname: [null, Validators.required],
        //email: [null, [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")]],
        email: [null, Validators.required],
        phone: [null],
        password: [null, Validators.required],
        confirmPassword: ['', Validators.required],
      },
      {
        validator: ConfirmPasswordValidator('password', 'confirmPassword'),
      }
    );
  }

  //get form controls
  get f() {
    return this.registerForm.controls;
  }

  sendUserData(message: string) {
    this.sharedService.nextCustomerMessage(message);
  }

  onSubmit() {
    this.submitted = true;
    let customer = {
      fullName: this.registerForm.value.fname,
      username: this.registerForm.value.uname,
      email: this.registerForm.value.email,
      phone: this.registerForm.value.phone,
      phoneExt: '+971',
      password: this.registerForm.value.password,
 
    };

    this.customerAuthService.register(customer).subscribe((data) => {
      console.log('Message is of type', typeof data.message);
      if (typeof data.message === 'undefined') {
        console.log('error message', data.error);
        this.errorMessage = data.error;
        this.successMessage = ""
        this.submitted = false
      } else {
        console.log('Message information', data.message);
        this.sendUserData(data.message);
        this.successMessage = "Account has been registered" 
        this.errorMessage = ""
        this.ngOnInit()
        setTimeout(() => {
          this.router.navigate(['../','thank-you-register'], { relativeTo: this.route });
        }, 3000);
      }
    });
 
  }

  toggleFieldTextType() {
    this.fieldTextType = !this.fieldTextType;
  }
}
