import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { Cart } from '../../model/cart.model';
import { SharedService } from '../../services/shared.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})

export class HeaderComponent implements OnDestroy {
  public cartList: Cart[];
  private destroy: Subject<Boolean>;
  constructor(private sharedService: SharedService) { 
    this.cartList = [];
    this.destroy = new Subject<Boolean>();
    
    // If we want to get data on browser load then localstorag will work
    // this.cartList = JSON.parse(localStorage.getItem('cart') || '[]');

    /** Add product in to the cart */
    this.sharedService.addCart.pipe(takeUntil(this.destroy)).subscribe((response:Cart)=> {
      const list: Cart[] = this.cartList.filter(h=>h.id == response.id);
      if(list.length > 0) {
        list[0].quantity = response.quantity;
      } else {
        this.cartList.push(response);
      }

      // Stor data in localstorage for main data on browser load
      // localStorage.setItem("cart",JSON.stringify(this.cartList));
    })

    /** Delete product in to the cart */
    this.sharedService.deleteCart.pipe(takeUntil(this.destroy)).subscribe((prodcutId: number)=> {
      this.cartList = this.cartList.filter(h=>h.id != prodcutId);

       // Delete data from localstorage for main data on browser load
      // localStorage.setItem("cart",JSON.stringify(this.cartList));
    })
  }

  /** This method of cycle use for the release momory */
  ngOnDestroy(): void{
    this.destroy.next();
    this.destroy.complete();
  }
}
