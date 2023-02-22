import { Component, OnInit } from '@angular/core';
import jwt_decode from 'jwt-decode';
import { CartService } from '../_services/cart.service';
import { OrderService } from '../_services/order.service';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { FormGroup, FormBuilder } from '@angular/forms';
import { SharedService } from '../_services/shared_service/shared.service';
import { CustomerAuthenticationService } from '../_auth/customer-authentication.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css'],
})
export class CheckoutComponent implements OnInit {
  pageTitle = 'Checkout | The Food Hub';

  checkoutForm: FormGroup;

  cartTotal: number;
  cartData: any;
  modes: any[];
  userData: any;
  radio_state: boolean = false;
  radioValue: any;
  customer: any;

  constructor(
    private title: Title,
    private custAuthService: CustomerAuthenticationService,
    private cartService: CartService,
    private orderService: OrderService,
    private router: Router,
    private spinner: NgxSpinnerService,
    private fb: FormBuilder,
    private sharedService: SharedService,
  ) {}

  ngOnInit(): void {
    this.title.setTitle(this.pageTitle);

    //Initialise form

    this.checkoutForm = this.fb.group({
      payment: [null],
      terms: [null],
      total: [null],
    });

    this.cartService.cartDataObs$.subscribe((data) => {
      this.cartData = data;
      console.log(this.cartData);
    });

    this.cartService.cartTotals$.subscribe((total) => {
      this.cartTotal = total;

      this.checkoutForm.patchValue({
        total: this.cartTotal,
      });
      //console.log(this.cartTotal)
    });

    //fetch payment modes

    this.modes = [
      { id: 1, name: 'Cash' },
      {
        id: 2,
        name: 'Card',
      },
    ];

    //check if radio button is selected
    console.log('radio button', this.checkoutForm.value.payment);
    this.customer = this.custAuthService.getUser(); 
 
  }

  //check if radio buttons are selected
  paymentChange() {
     this.radioValue = this.checkoutForm.value.payment;

    let terms = this.checkoutForm.value.terms;
    console.log('Checkbox', terms);
    if (this.radioValue  == null || terms == null) {
      //window.alert("This is null")
      this.radio_state = false;
    } else if (this.radioValue  != null && terms != null) {
      this.radio_state = true;
    }
  }
 
  //checkout method
  onCheckout() {
    let customerToken = this.custAuthService.getToken();
    let decoded = jwt_decode(customerToken);
    this.spinner.show().then((p) => {
      let paymenId = +this.checkoutForm.value.payment;
      var total = +this.checkoutForm.value.total;
      
      this.cartService.CheckoutFromCart(
        this.customer.id,
        paymenId,
        total
      );
      
    });
  }
}
