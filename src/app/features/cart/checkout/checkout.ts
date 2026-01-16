import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-checkout',
  imports: [],
  templateUrl: './checkout.html',
  styleUrl: './checkout.scss',
})
export class CheckoutComponent {
  constructor(private router: Router) {}

  continueShopping(): void {
    this.router.navigate(['/home']);
  }
}
