import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators'

import { ProductService } from '../service/product.service';
import { Product } from '../model/product.model';
import { SharedService } from 'src/app/core/services/shared.service';
import { Cart } from 'src/app/core/model/cart.model';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit,OnDestroy {
 private destroy: Subject<boolean>;
 public productList: Product[];
 // Clone ProductList variable fro maintain actual stock
 public cloneProductList: Product[];
  constructor(private productService: ProductService,
    private sharedService: SharedService) { 
    this.destroy = new Subject<boolean>();
  }

  ngOnInit(): void {
    this.getProductList();
  }

  /**
   * Get Product list from the service
   */
  public getProductList(): void {
    this.productService.getProductList().pipe(takeUntil(this.destroy)).subscribe((response: any[]) =>{
      this.productList =  response;
      this.cloneProductList  = JSON.parse(JSON.stringify(response));
  
      // If we want to get data on browser load then localstorag will work

      // let localStoragData : any[] = JSON.parse(localStorage.getItem('cart') || '[]');
      // if(localStoragData.length > 0){
      //   localStoragData.forEach((element:Cart) => {
      //     const data = this.productList.filter(h=>h.id == element.id);
      //     if(data.length> 0) {
      //       data[0].quantity = element.quantity;
      //       data[0].price = element.price;
      //       data[0].totalPrice = element.totalPrice;
      //       data[0].isAddedInCart = true;
      //       data[0].message = `${data[0].title} - ${data[0].quantity}`
      //     }
      //   });
      // }
    })
  }

  /**
   * This method use for add Quanlity
   */
  public addQuantity(product: Product): void{
    const stock: number = this.getActualStock(product.id);
    if (product.quantity > product.stock) {
      // this condition for if quantity is more than stock.
      product.message = `${product.quantity} quantity not available in a stock`;
      product.stock = stock;
      product.totalPrice = 0;
    } 
     else if(product.quantity < 5){
      product.message = "Please increase the Quantity";
      product.stock = stock;
      product.totalPrice = 0;
    }
    else if(product.quantity >= 5 && product.quantity <=10) {
      product.message = `${product.title} - ${product.quantity}`
      this.calculateTotalPrice(product);
      product.stock = stock - product.quantity;
    } else if( product.quantity > 10 && product.quantity <= 50){
      product.message = `${product.title} - ${product.quantity}`;
      this.calculateTotalPrice(product);
      product.stock = stock - product.quantity;

    } else if(product.quantity > 50){
      product.message = "You can add only 50 quantity maximum."
      product.stock = stock;
      product.totalPrice = 0;
    }
  }

  /** This method use for add product in to the Cart */
  public addToCart(product: Product): void{
    product.isAddedInCart = true;
    this.sharedService.addCart.next(this.setCartObject(product));
  }

  
  /** This method use for delete product from the cart */
  public deleteToCart(product: Product): void{
    product.isAddedInCart = false;
    this.sharedService.deleteCart.next(product.id);
  }

  /**
   * This method use for allow only numbers
   * @param event 
   */
  public onlyNumberAllowed(event:any): boolean{
    const charCode = (event.which) ? event.which : event.KeyCode;
    if(charCode > 31 && (charCode < 48 || charCode > 57)){
      return false;
    }
    return true;
  }

  /** 
   * This method use for calcualre Total Price of the product
   */
  public calculateTotalPrice(product: Product): void {
    product.totalPrice = product.price * product.quantity;
  }

  /**
   * This method use for get actual stock for maintain stock
   * @param productId 
   */
  public getActualStock(productId: number): number{
    const data: Product[] = this.cloneProductList.filter(h=>h.id == productId);
    if(data.length) {
      return data[0].stock;
    }
    return 0;
  }

  /** This method use for set project object in to cart for add to cart */
  public setCartObject(product: Product):Cart{
    const cart: Cart = {
      id : product.id,
      title : product.title,
      quantity : product.quantity,
      price: product.price,
      totalPrice : product.totalPrice
    }
    return cart;
  } 

  /**
   * Release Memory 
   */
  public ngOnDestroy(): void {
    this.destroy.next();
    this.destroy.complete();
  }

}
