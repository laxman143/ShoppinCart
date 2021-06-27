import { Cart } from 'src/app/core/model/cart.model';

export class Product extends Cart {
    public stock: number;
    public message: string;
    public isAddedInCart: boolean;
}