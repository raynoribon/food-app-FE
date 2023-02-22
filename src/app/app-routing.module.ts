import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthCustGuard } from './_auth/auth-cust.guard';
import { HomeComponent } from './home/home.component';
import { RestaurantMenuComponent } from './restaurant-menu/restaurant-menu.component';
import { RestaurantsComponent } from './restaurants/restaurants.component';
import { RestaurantListComponent } from './restaurant-list/restaurant-list.component';
import { CartComponent } from './cart/cart.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { FoodComponent } from './food/food.component';
import { ProductPageComponent } from './product-page/product-page.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { LoginComponent } from './login/login.component';
import { AccountProfileComponent } from './account-profile/account-profile.component';

import { ProductsComponent } from './products/products.component';
import { CustomerComponent } from './customer/customer.component';
import { TermsComponent } from './terms/terms.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { OrderDetailsComponent } from './account-profile/shared/order-details/order-details.component';
import { MyOrdersComponent } from './account-profile/shared/my-orders/my-orders.component';
import { ThanksRegisterComponent } from './thanks-register/thanks-register.component';


//Import Auth guards

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  {
    path: 'restaurants',
    component: RestaurantsComponent,
    children: [
      { path: '', redirectTo: 'list', pathMatch: 'full' },
      { path: 'list', component: RestaurantListComponent },
      { path: ':id', component: RestaurantMenuComponent },
    ],
  },
  {
    path: 'products',
    component: ProductsComponent,
    children: [
      {
        path: ':id',
        component: ProductPageComponent,
      },
    ],
  },
  { path: 'cart', component: CartComponent },
  { path: 'checkout', component: CheckoutComponent },

  {
    path: 'customer',
    component: CustomerComponent,
    children: [
      { path: 'login', component: LoginComponent },
      { path: 'register', component: SignUpComponent },
      { path: 'thank-you-register', component: ThanksRegisterComponent },
      {
        path: 'profile',
        component: AccountProfileComponent,
        children: [
          { path: '', redirectTo: 'orders', pathMatch: 'full' },
          { path: 'orders', component: MyOrdersComponent },
          { path: 'order-details/:id', component: OrderDetailsComponent },
        ],
        canActivate: [AuthCustGuard],
      },
      { path: 'terms', component: TermsComponent },
    ],
  },
  //Start admin section
 
  { path: '**', component: PageNotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
