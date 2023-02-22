import { BrowserModule } from '@angular/platform-browser';
import {BrowserAnimationsModule,NoopAnimationsModule} from '@angular/platform-browser/animations'
import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from "@angular/common/http";
import { ToastrModule } from 'ngx-toastr';
import { NgxSpinnerModule } from "ngx-spinner";
import {TranslateModule, TranslateLoader} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import { AppRoutingModule } from './app-routing.module';
import { MatDialogModule} from '@angular/material/dialog';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import {NgxPaginationModule} from 'ngx-pagination'; 
import { AppComponent } from './app.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { FooterComponent } from './footer/footer.component';
import { NavbarComponent } from './navbar/navbar.component';
import { HomeComponent } from './home/home.component';
import { RestaurantsComponent } from './restaurants/restaurants.component';
import { RestaurantMenuComponent } from './restaurant-menu/restaurant-menu.component';
import { RestaurantTabComponent } from './restaurant-tab/restaurant-tab.component';
import { RestaurantListComponent } from './restaurant-list/restaurant-list.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { ProductPageComponent } from './product-page/product-page.component';
import { CartComponent } from './cart/cart.component';
import { FoodComponent } from './food/food.component';
import { FoodPageComponent } from './food-page/food-page.component';
import { RestaurantPageComponent } from './restaurant-page/restaurant-page.component';
import { LoginComponent } from './login/login.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { ProductsComponent } from './products/products.component';
import { TermsComponent } from './terms/terms.component';
import { SearchByPipe } from './_filter/search-by.pipe';
import { CustomerComponent } from './customer/customer.component';
import { AccountProfileComponent } from './account-profile/account-profile.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { OrderDetailsComponent } from './account-profile/shared/order-details/order-details.component';
import { MyOrdersComponent } from './account-profile/shared/my-orders/my-orders.component';
import { ThanksRegisterComponent } from './thanks-register/thanks-register.component';
import { MenuMainComponent } from './menu-main/menu-main.component';
import { DashboardMainComponent } from './dashboard-main/dashboard-main.component';
import { GeneralSettingsComponent } from './general-settings/general-settings.component';


@NgModule({
  declarations: [
    AppComponent,
    FooterComponent,
    NavbarComponent,
    HomeComponent,
    RestaurantsComponent,
    RestaurantMenuComponent,
    RestaurantTabComponent,
    RestaurantListComponent,
    CheckoutComponent,
    ProductPageComponent,
    CartComponent,
    FoodComponent,
    FoodPageComponent,
    RestaurantPageComponent,
    LoginComponent,
    SignUpComponent,
    ProductsComponent,
    TermsComponent,
    SearchByPipe,
    CustomerComponent,
    AccountProfileComponent,
    PageNotFoundComponent,
    ForgotPasswordComponent,
    OrderDetailsComponent,
    MyOrdersComponent,
    ThanksRegisterComponent,
    MenuMainComponent,
    DashboardMainComponent,
    GeneralSettingsComponent,
  ], 
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    ToastrModule.forRoot(), // ToastrModule added
    NgxSpinnerModule,
    NoopAnimationsModule,
    MatDialogModule,
    NgxSkeletonLoaderModule.forRoot(),
    NgxPaginationModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        //useClass: TranslationService,
        useFactory: httpTranslateLoader,
        deps: [HttpClient]
      },
      defaultLanguage: 'English'
    }),
    
    
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [LoginComponent]
})
export class AppModule { }

// AoT requires an exported function for factories
export function httpTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http);
}
