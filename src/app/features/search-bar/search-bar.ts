import { Component, HostListener, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductHttp } from '../../shared/services/product-http';
import { ProductCard } from '../../shared/models/ProductCard';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  providers: [ProductHttp],
  templateUrl: './search-bar.html',
  styleUrls: ['./search-bar.css'],
})
export class SearchBar {

  @Output() openAdvancedSearchModal = new EventEmitter<void>();

  searchText: string = '';
  products: ProductCard[] = [];
  filteredProducts: ProductCard[] = [];
  slider: any;
  minPrice: number = 0;
  maxPrice: number = 5000;
  filtersActive: boolean = false;

  constructor(
    private productHttp: ProductHttp,
    private router: Router
  ) {
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    // Cerchiamo il container specifico di QUESTA istanza
    // Nota: Se ci sono più search bar, questo selettore generico potrebbe chiuderle tutte,
    // ma va bene per il comportamento dropdown.
    const searchContainer = target.closest('.search-dropdown-container');
    
    // Se il click non è dentro un search container, chiudi
    if (!searchContainer) {
      this.closeDropdown();
    }
  }

  closeDropdown(): void {
    this.products = [];
  }

  goToProduct(productId: number): void {
    this.closeDropdown();
    this.searchText = '';
    this.router.navigate(['product', productId]);
  }

  onSearchBase(): void {
    if (this.filtersActive) {
      return;
    }
    if (!this.searchText.trim()) {
      this.products = [];
      return;
    }
    this.productHttp
      .SearchProduct(this.searchText, this.minPrice, this.maxPrice)
      .subscribe((result) => {
        this.products = result.items;
      });
  }

  trackByProductId(index: number, item: ProductCard): number {
    return item.productId;
  }
}