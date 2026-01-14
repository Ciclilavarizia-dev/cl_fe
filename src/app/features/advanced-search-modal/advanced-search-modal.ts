import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ProductHttp } from '../../shared/services/product-http';
import { Router } from '@angular/router';
import { ProductCard } from '../../shared/models/ProductCard';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Card } from '../product/cards-container/card/card';

@Component({
  selector: 'app-advanced-search-modal',
  imports: [CommonModule, FormsModule, Card],
  templateUrl: './advanced-search-modal.html',
  styleUrl: './advanced-search-modal.css',
})
export class AdvancedSearchModal {

  @Input() open = false;
  @Output() closed = new EventEmitter<void>();

  searchText = '';
  filteredProducts: ProductCard[] = [];
  minPrice = 0;
  maxPrice = 5000;
  filtersActive = false;

  constructor(
    private productHttp: ProductHttp,
    private router: Router
  ) { }

  // Prevents external scroll when modal is opened
  ngOnChanges() {
    document.body.classList.toggle('modal-open', this.open);
  }

  close(): void {
    this.open = false;
    this.closed.emit();
    document.body.classList.remove('modal-open');
    this.resetState();
  }

  goToProduct(productId: number): void {
    this.close();
    setTimeout(() => {
      this.router.navigate(['product', productId]);
    });
  }

  onSearch(): void {
    this.filtersActive = true;

    this.productHttp
      .SearchProduct(this.searchText, this.minPrice, this.maxPrice)
      .subscribe(r => {
        this.filteredProducts = r.items.slice(0, 10);
      });
  }

  resetFilters(): void {
    this.minPrice = 0;
    this.maxPrice = 5000;
    this.onSearch();
  }

  private resetState(): void {
    this.searchText = '';
    this.filteredProducts = [];
    this.filtersActive = false;
  }
}
