import { Component, OnInit } from '@angular/core';
import { CustomerAuthenticationService } from '../_auth/customer-authentication.service';
 
import { OrderService } from '../_services/order.service';

@Component({
  selector: 'app-account-profile',
  templateUrl: './account-profile.component.html',
  styleUrls: ['./account-profile.component.css'],
})
export class AccountProfileComponent implements OnInit {
 
  userData: any;
  customerProfile: any;
 

  add_new: boolean = false;
  orders: any;

  constructor(
    public custAuthService: CustomerAuthenticationService,
    private orderService: OrderService
  ) {}

  ngOnInit(): void {

    //fetch user token and decode
    let customerToken = this.custAuthService.getToken();
    this.customerProfile = this.custAuthService.getUser(); 
     
  }

  submit(btn_value: string) {
    //console.log("This details form", this.detailsForm.value)
    switch (btn_value) {
      
      case 'address':
        console.log('This address form');
        this.add_new = false;
        break;
      default:
        console.log('No value has been selected');
    }
  }

  
}
