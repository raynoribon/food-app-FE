import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import 'rxjs/operators';
import {
  HttpErrorResponse,
  HttpClient,
  HttpHeaders,
} from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private server_url = environment.serverURL;

  constructor(private http: HttpClient) {}

  // retrieving products
  getProducts(numberofResults: number = 10): Observable<any> {
    return this.http
      .get(this.server_url + '/items')
      .pipe(
        catchError((error) => {
          let errorMsg: string;
          if (error.error instanceof ErrorEvent) {
            errorMsg = `Error: ${error.error.message};
      }`;
          } else {
            errorMsg = this.getServerErrorMessage(error);
          }
          return throwError(errorMsg);
        })
      );
  }

  getSingleProduct(productId: Number): Observable<any> {
    return this.http
      .get<any>(this.server_url + '/items/' + productId)
      .pipe(
        catchError((error) => {
          let errorMsg: string;
          if (error.error instanceof ErrorEvent) {
            errorMsg = `Error: ${error.error.message};
      }`;
          } else {
            errorMsg = this.getServerErrorMessage(error);
          }
          return throwError(errorMsg);
        })
      );
  }

  //Fetch products by restaurant
  getProductsByRestaurant(restaurantId: Number): Observable<any> {
    return this.http
      .get(this.server_url + '/restaurants/' + restaurantId)
      .pipe(
        catchError((error) => {
          let errorMsg: string;
          if (error.error instanceof ErrorEvent) {
            errorMsg = `Error: ${error.error.message};
      }`;
          } else {
            errorMsg = this.getServerErrorMessage(error);
          }
          return throwError(errorMsg);
        })
      );
  }

   
 

  //Get Http server errors
  private getServerErrorMessage(errorResponse: HttpErrorResponse): string {
    switch (errorResponse.status) {
      case 404: {
        return `Not Found: ${errorResponse.message}`;
      }
      case 403: {
        return `Access Denied: ${errorResponse.message}`;
      }
      case 500: {
        return `Internal Server Error: ${errorResponse.message}`;
      }
      default: {
        return `Unknown Server Error: ${errorResponse.message}`;
      }
    }
  }
}
