import { CartService } from './services/cart.service';
export function initServicesFactory(
  cartService: CartService
) {
  return async () => {
    const token = localStorage.getItem('token');
    if (token) {
      cartService.init();
    }
  };
}