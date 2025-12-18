import { Component, HostListener } from '@angular/core';
import { ProductList } from '../../../shared/models/ProductList';
import { AdminProductHttp } from '../../../shared/services/admin/admin-product-http';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './products.html',
  styleUrl: './products.css',
})
export class Products {

  products: ProductList[] = [];

  totalCount = 0;

  page = 1;
  pageSize = 20;

  sortBy = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  isLoading = true;

  activeProductId: number | null = null;

  constructor(private productService: AdminProductHttp, private router: Router) { }

  goToEdit(productId: number, event: MouseEvent) {
    event.stopPropagation();
    this.activeProductId = null;
    console.log('navigate to product n°', productId);
    this.router.navigate(['/admin/products/edit', productId]);
  }

  ngOnInit(): void {
    this.loadProducts();

    // close popover when clicking anywhere else
    document.addEventListener('click', this.onDocumentClick);
  }

  ngOnDestroy(): void {
    document.removeEventListener('click', this.onDocumentClick);
  }

  loadProducts() {
    this.isLoading = true;

    this.productService
      .getProducts(this.page, this.pageSize, this.sortBy, this.sortDirection)
      .subscribe({
        next: res => {
          this.products = res.items;
          this.totalCount = res.totalCount;
          this.isLoading = false;
        },
        error: err => {
          console.error(err);
          this.isLoading = false;
        }
      });
  }

  changeSort(column: string) {
    if (this.sortBy === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortBy = column;
      this.sortDirection = 'asc';
    }

    this.loadProducts();
  }

  nextPage() {
    this.page++;
    this.loadProducts();
  }

  prevPage() {
    if (this.page > 1) {
      this.page--;
      this.loadProducts();
    }
  }

  get totalPages(): number {
    return Math.ceil(this.totalCount / this.pageSize)
  }

  toggleActions(productId: number, event: MouseEvent) {
    event.stopPropagation();
    this.activeProductId = this.activeProductId === productId ? null : productId;
  }

  @HostListener('document:click')
  onDocumentClick() {
    this.activeProductId = null;
  }

}
