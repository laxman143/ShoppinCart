import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../model/product.model';

@Injectable()
export class ProductService {

  constructor(private http:HttpClient) { }

  /**
   * Get Product list from json server
   */
  public getProductList():Observable<any> {
    return this.http.get("http://localhost:3000/product");
  }
  
}
