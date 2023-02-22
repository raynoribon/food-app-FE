import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ProductsService } from './products.service';
import { OrderService } from './order.service';
import { environment } from 'src/environments/environment';
import { BehaviorSubject } from 'rxjs';
import { Router, NavigationExtras } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { CustomerAuthenticationService } from '../_auth/customer-authentication.service';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private server_url = environment.serverURL;

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

  //Data variable to store cart information on the server
  private cartDataServer: any = {
    total: 0,
    data: [
      {
        numInCart: 0,
        product: undefined,
      },
    ],
  };

  /*OBSERVABLES FOR THE COMPONENT TO SUBSCRIBE */
  cartTotals$ = new BehaviorSubject<number>(0);
  cartDataObs$ = new BehaviorSubject<any>(this.cartDataServer);
  token:string;

  constructor(
    private httpClient: HttpClient,
    private productsService: ProductsService,
    public custAuthService: CustomerAuthenticationService,
    private orderService: OrderService,
    private router: Router,
    private toast: ToastrService,
    private spinner: NgxSpinnerService
  ) {
    this.cartTotals$.next(this.cartDataServer.total);
    this.cartDataObs$.next(this.cartDataServer);

    //Get the information from local storage (if any)
    let info: any = JSON.parse(localStorage.getItem('cart'));
    //Check if the info variable is null or has some data in it
    if (info !== null && info !== undefined && info.prodData[0].incart !== 0) {
      this.cartDataClient = info;
      //Loop through each entry and put it in the cartDataServer object
      this.cartDataClient.prodData.forEach((p) => {
        if (this.cartDataServer.data[0].numInCart == 0) {
          this.cartDataServer.data[0].numInCart = p.incart;
          this.cartDataServer.data[0].product = p.prod;
          this.CalculateTotal();
          //
          this.cartDataClient.total = this.cartDataServer.total;
          localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
        } else {
          //cartDataserver already has some entry in it
          this.cartDataServer.data.push({
            numInCart: p.incart,
            product: p.prod,
          });
          this.CalculateTotal();
          this.cartDataClient.total = this.cartDataServer.total;
          localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
        }
        this.cartDataObs$.next({ ...this.cartDataServer });
      });
    }
  }

  //calculate product subtotal
  CalculateSubTotal(index): Number {
    let subTotal = 0;

    let p = this.cartDataServer.data[index];
    subTotal = p.product.restaurantItems.amount * p.numInCart;
    return subTotal;
  }

  AddProductToCart(prod, quantity?: number) {
    console.log('The id passed is', prod.id);
    
    console.log('This prod from cart service', prod);
    //1. if the cart is empty
    if (this.cartDataServer.data[0].product === undefined) {
      this.cartDataServer.data[0].product = prod;
      this.cartDataServer.data[0].numInCart =
        quantity !== undefined ? quantity : 1;
      this.cartDataServer.data[0].product.quantity = quantity !== undefined ? quantity : 1;

      this.CalculateTotal();
      this.cartDataClient.prodData[0].incart = this.cartDataServer.data[0].numInCart;
      this.cartDataClient.prodData[0].prod = prod;
      this.cartDataClient.prodData[0].prod.quantity = quantity !== undefined ? quantity : 1;
      this.cartDataClient.total = this.cartDataServer.total;
      //update local storage
      localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
      this.cartDataObs$.next({ ...this.cartDataServer });
      this.toast.success(
        `${prod.name} added to the cart.`,
        'Product Added',
        {
          timeOut: 3600,
          progressBar: true,
          progressAnimation: 'increasing',
          positionClass: 'toast-bottom-full-width',
        }
      );
    } // END of if

    //2. Cart is not empty
    else {
      let index = this.cartDataServer.data.findIndex(
        (p) => p.product.id === prod.id
      ); //-1 or a positive value

      console.log('Index is', index);

      //1. if chosen product is already in cart array
      if (index !== -1) {
        if (quantity !== undefined && quantity <= prod.quantity) {
          this.cartDataServer.data[index].numInCart = this.cartDataServer.data[index].numInCart < prod.quantity ? quantity : prod.quantity;
        } else {
          //this.cartDataServer.data[index].numInCart = this.cartDataServer.data[index].numInCart < prod.quantity ? this.cartDataServer.data[index].numInCart++ : prod.quantity;
          this.cartDataServer.data[index].numInCart < prod.quantity ? this.cartDataServer.data[index].numInCart++ : prod.quantity;
        }

        this.cartDataClient.prodData[index].incart = this.cartDataServer.data[index].numInCart;
        this.CalculateTotal();
        this.cartDataClient.total = this.cartDataServer.total;
        localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
        this.cartDataObs$.next({ ...this.cartDataServer });
        this.toast.info(
          `${prod.name} quantity updated in the cart.`,
          'Product Updated',
          {
            timeOut: 3600,
            progressBar: true,
            progressAnimation: 'increasing',
            positionClass: 'toast-bottom-full-width',
          }
        );
      } //end of if
      //2. If the chosen product is not in the cart array
      else {
        this.cartDataServer.data.push({
          numInCart: 1,
          product: prod,
        });

        this.cartDataClient.prodData.push({
          incart: 1,
          id: prod.id,
          prod
        });

        this.toast.success(
          `${prod.name} quantity added in the cart.`,
          'Product Updated',
          {
            timeOut: 3600,
            progressBar: true,
            progressAnimation: 'increasing',
            positionClass: 'toast-bottom-full-width',
          }
        );

        this.CalculateTotal();
        this.cartDataClient.total = this.cartDataServer.total;
        localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
        this.cartDataObs$.next({ ...this.cartDataServer });
      }
    } //END of else
  }

  UpdateCartData(index: number, increase: Boolean) {
    let data = this.cartDataServer.data[index];
    if (increase) {
      //data.numInCart < data.product.quantity ? ++data.numInCart : data.product.quantity;
      ++data.numInCart;
      this.cartDataClient.prodData[index].incart = data.numInCart;
      this.CalculateTotal();
      this.cartDataClient.total = this.cartDataServer.total;
      localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
      this.cartDataObs$.next({ ...this.cartDataServer });
      
    } else {
      data.numInCart--;

      if (data.numInCart < 1) {
        this.DeleteProductFromCart(index);
        this.cartDataObs$.next({ ...this.cartDataServer });
        this.cartDataClient.prodData[index].incart = data.numInCart;
        this.CalculateTotal();
        this.cartDataClient.total = this.cartDataServer.total;
        localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
      }
    }
  }

  DeleteProductFromCart(index) {
    if (window.confirm('Are you sure you want to delete this item?')) {
      this.cartDataServer.data.splice(index, 1);
      this.cartDataClient.prodData.splice(index, 1);
      this.CalculateTotal();
      this.cartDataClient.total = this.cartDataServer.total;

      if (this.cartDataClient.total === 0) {
        this.cartDataClient = { prodData: [{ incart: 0, id: 0, prod: {} }], total: 0 };
        localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
      } else {
        localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
      }

      if (this.cartDataServer.total === 0) {
        this.cartDataServer = {
          data: [
            {
              product: undefined,
              numInCart: 0,
            },
          ],
          total: 0,
        };
        this.cartDataObs$.next({ ...this.cartDataServer });
      } else {
        this.cartDataObs$.next({ ...this.cartDataServer });
      }
    }
    //if the user doesn't want to delete the product, hits the CANCEL button
    else {
      return;
    }
  }

  CheckoutFromCart(customerId: number, paymentId: number, total: number) {
      
      this.httpClient
        .post(`${this.server_url}/orders`, this.getOrderData({
          customerId: customerId,
          paymentId: paymentId,
          total:total,
          products: this.cartDataClient.prodData,
        }), { headers: { Authorization: `Bearer ${this.custAuthService.getToken()}` } })
        .subscribe((data: any) => {
          this.resetServerData();
          this.orderService.getSingleOrder(data.order_id).then((prods) => {
            if (data.success) {
              const navigationExtras: NavigationExtras = {
                state: {
                  message: data.message,
                  products: prods,
                  orderId: data.order_id,
                  order_reference: data.order_reference,
                  total: this.cartDataClient.total,
                },
              };
              this.spinner.hide();
              this.router
                .navigate(['/thank-you'], navigationExtras)
                .then((p) => {
                  this.cartDataClient = {
                    prodData: [{ incart: 0, id: 0 , prod: {}}],
                    total: 0,
                  };
                  this.cartTotals$.next(0);
                  localStorage.setItem(
                    'cart',
                    JSON.stringify(this.cartDataClient)
                  );
                });
            }
          });

        });
    // } else {
    //   this.spinner.hide();
    //   this.router.navigateByUrl('/checkout').then();
    //   this.toast.error(`Sorry, failed to book the order`, 'Order Status', {
    //     timeOut: 1500,
    //     progressBar: true,
    //     progressAnimation: 'increasing',
    //     positionClass: 'toast-top-right',
    //   });
    // }
  }

  private CalculateTotal() {
    let total = 0;

    this.cartDataServer.data.forEach((p) => {
      const { numInCart } = p;
      const { amount } = p.product.restaurantItems;
      //@ts-ignore
      total += numInCart * amount;
    });
    this.cartDataServer.total = total;
    this.cartTotals$.next(this.cartDataServer.total);
  }

  private resetServerData() {
    this.cartDataServer = {
      data: [
        {
          product: undefined,
          numInCart: 0,
        },
      ],
      total: 0,
    };
    this.cartDataObs$.next({ ...this.cartDataServer });
  }

  private getOrderData(data) {
    return {
      totalAmount: data.total,
      totalItems:data.products.length,
      restaurantId: 1,
      userId:data.customerId,
      status: 'placed',
      paymentStatus: 'notPaid',
      items: this.getItems(data.products)
      }
  }
  private  getItems(products) {
      let items= [];
      for (const item of products) {
        items.push({
          pricePerItem: item.prod.restaurantItems.amount,
          totalItemAmount: item.prod.restaurantItems.amount * item.incart,
          noOfItem: item.incart,
          itemId: item.id
        })
      }
      return items;
  }
}



interface OrderConfirmationResponse {
  order_id: Number;
  order_reference: String;
  success: Boolean;
  message: String;
  products: [
    {
      id: String;
      numInCart: String;
    }
  ];
}
