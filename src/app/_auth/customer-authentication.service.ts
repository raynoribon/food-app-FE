import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { map, retry, catchError } from 'rxjs/operators';
import { NgxSpinnerService } from 'ngx-spinner';

import 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class CustomerAuthenticationService {

  private _registerUrl = "http://localhost:3000/signup";
  private _loginUrl = "http://localhost:3000/login";

  private token: string
  private user: any;


  //Data variable to store the cart information on the client's local storage
  private cartDataClient: any = {
    total: 0,
    prodData: [
      {
        incart: 0,
        id: 0,
        prod: {}
      },
    ],
  };
  
  constructor(private http: HttpClient, private router: Router,private spinner: NgxSpinnerService) { }

  //save token
  public saveToken(token: string): void {
    localStorage.setItem('token', token)
    this.token = token;
  }


  //get token
  public getToken(): string {
    if (!this.token) {
      this.token = localStorage.getItem('token')
    }
    return this.token
  }

  //get user
  public getUser(): string {
    if (!this.user) {
      this.user = localStorage.getItem('user')
    }
    return this.user
  }

  //save user
  public saveUser(user: string): void {
    localStorage.setItem('user', JSON.stringify(user))
    this.user = user;
  }

  //get customer details
  public getcustomerDetails() {
    const token = this.getToken()
    let payload
    if (token) {
      payload = token.split('.')[1]
      payload = window.atob(payload)
      return JSON.parse(payload)
    } else {
      return null
    }
  }

  //Logged in
  public isLoggedIn(): boolean {
    const customer = this.getcustomerDetails()
    if (customer) {
      return customer.exp > Date.now() / 1000
    } else {
      return false
    }
  }
 

  private request(method: 'post' | 'get', type: 'login' | 'signup' | 'users', customer?): Observable<any> {
    let base;

    if (method === 'post') {
      base = this.http.post(`http://localhost:3000/authentication/${type}`, customer);
    } else {
      base = this.http.get(`http://localhost:3000/${type}`, { headers: { Authorization: `Bearer ${this.getToken()}` } });
    }

    const request = base.pipe(
      map((data: any) => {
        if (data.data.token) {
          this.saveToken(data.data.token);
        }
        return data;
      })
    );

    return request;
  }

  public register(customer) {
    return this.request('post', 'signup', customer);
  }

  public login(customer) {
    return this.request('post', 'login', customer);
  }

  public profile(): Observable<any> {
    return this.request('get', 'users');
  }

  //logout
  public logout(): void {

    localStorage.clear();
    this.token = ''

      //Get the information from local storage (if any)
  let info: any = JSON.parse(localStorage.getItem('cart'));
  //Check if the info variable is null or has some data in it
  if (info !== null && info !== undefined && info.prodData[0].incart !== 0) {
    if (window.confirm('Your shopping cart still has items. If you logout this data will be lost. Do you wish to continue?')) {
      window.localStorage.removeItem('customerToken')
      this.router.navigateByUrl('/customer/login')
      .then((p) => {
        this.cartDataClient = {
          prodData: [{ incart: 0, id: 0 , prod: {}}],
          total: 0,
        };
        localStorage.setItem(
          'cart',
          JSON.stringify(this.cartDataClient)
        );
      });
    } else{
      return 
    }
  }else{
    if (window.confirm('Are you sure you want to logout?')) {
      window.localStorage.removeItem('customerToken')
      this.router.navigateByUrl('/customer/login')
    
    } else{
      return
    }
  } 
    
  }

}
