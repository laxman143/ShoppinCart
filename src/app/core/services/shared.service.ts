import { Injectable } from '@angular/core';
import { Cart } from '../model/cart.model';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  /**
   * addCart subject use for send (broadcast) value from product component to header component for add product inc cart
   */
  public addCart: Subject<Cart>;
   /**
   * deletCart subject use for send (broadcast) value from product component to header component for delete product from the cart
   */
  public deleteCart : Subject<number>;
  constructor() { 
    this.addCart = new Subject<Cart>();
    this.deleteCart = new Subject<number>();
  }
}
