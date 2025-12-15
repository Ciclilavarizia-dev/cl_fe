import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ProductHttp } from '../../../shared/services/product-http';
import { ProductCard } from '../../../shared/models/ProductCard';
import { Category } from '../../../shared/models/Category';
import { Card } from '../../product/cards-container/card/card';

type HomeProductCard = ProductCard & {
  homeImage?: string;
};

@Component({
  selector: 'app-highlight-section',
  standalone: true,
  imports: [CommonModule, Card],
  templateUrl: './highlight-section.html',
  styleUrl: './highlight-section.css',
})
export class HighlightSection implements OnInit {
  bestSellers: HomeProductCard[] = [];
  newArrivals: HomeProductCard[] = [];
  featuredCategories: Category[] = []; // Tutte le categorie, nessun slice

  currentBestSellerIndex = 0;
  currentNewArrivalIndex = 0;

  constructor(private productHttp: ProductHttp, private router: Router) {}

  ngOnInit() {
    this.loadData();
  }

  homeImages: { [productId: number]: string } = {
    708: '/assets/images/products/708.png',
    715: '/assets/images/products/884.png',
    712: '/assets/images/products/712.png',
    864: '/assets/images/products/864.png',
    865: '/assets/images/products/865.png',
    866: '/assets/images/products/866.png',
    867: '/assets/images/products/867.png',
    868: '/assets/images/products/868.png',
    869: '/assets/images/products/868.png',
    870: '/assets/images/products/870.png',
    871: '/assets/images/products/871.png',
    872: '/assets/images/products/872.png',
    873: '/assets/images/products/873.png',
    875: '/assets/images/products/875.png',
    880: '/assets/images/products/880.png',
    884: '/assets/images/products/884.png',
    883: '/assets/images/products/865.png',
    877: '/assets/images/products/877.png'
    // Aggiungi qui le immagini personalizzate
  };

  loadData() {
    this.productHttp.GetBestSellers(20).subscribe((data) => {
      this.bestSellers = data.map((p) => ({
        ...p,
        homeImage: this.applyHomeImage(p),
      }));
    });

    this.productHttp.GetNewArrivals(20).subscribe((data) => {
      this.newArrivals = data.map((p) => ({
        ...p,
        homeImage: this.applyHomeImage(p),
      }));
    });

    this.productHttp.GetFeaturedCategories().subscribe((data) => {
      this.featuredCategories = data.map((c) => ({
        ...c,
        imageUrl: this.getCategoryImage(c.name),
      }));
    });
  }

  private applyHomeImage(product: ProductCard): string {
    if (this.homeImages[product.productId]) {
      return this.homeImages[product.productId]; // Usa immagine personalizzata
    }

    if (
      product.thumbNailPhoto &&
      !product.thumbNailPhoto.includes('No image') &&
      !product.thumbNailPhoto.includes('data:image')
    ) {
      return product.thumbNailPhoto; // Usa immagine buona dell’API
    }

    return '/assets/images/products/0.png'; // Fallback
  }

  // NAVIGAZIONE BEST SELLERS
  nextBestSeller() {
    if (this.currentBestSellerIndex + 5 < this.bestSellers.length) {
      this.currentBestSellerIndex += 5;
    }
  }

  prevBestSeller() {
    if (this.currentBestSellerIndex - 5 >= 0) {
      this.currentBestSellerIndex -= 5;
    }
  }

  // NAVIGAZIONE NEW ARRIVALS
  nextNewArrival() {
    if (this.currentNewArrivalIndex + 5 < this.newArrivals.length) {
      this.currentNewArrivalIndex += 5;
    }
  }

  prevNewArrival() {
    if (this.currentNewArrivalIndex - 5 >= 0) {
      this.currentNewArrivalIndex -= 5;
    }
  }

  // VISIBLE ITEMS
  get visibleBestSellers() {
    return this.bestSellers.slice(this.currentBestSellerIndex, this.currentBestSellerIndex + 5);
  }

  get visibleNewArrivals() {
    return this.newArrivals.slice(this.currentNewArrivalIndex, this.currentNewArrivalIndex + 5);
  }

  get canGoPrevBestSeller() {
    return this.currentBestSellerIndex > 0;
  }
  get canGoNextBestSeller() {
    return this.currentBestSellerIndex + 5 < this.bestSellers.length;
  }

  get canGoPrevNewArrival() {
    return this.currentNewArrivalIndex > 0;
  }
  get canGoNextNewArrival() {
    return this.currentNewArrivalIndex + 5 < this.newArrivals.length;
  }

  onCategoryClick(category: Category) {
    // Naviga alla pagina prodotti filtrati per categoria
    this.router.navigate(['/products'], { queryParams: { categoryId: category.categoryId } });
  }

  // TRACK BY
  trackByProduct(index: number, product: ProductCard): number {
    return product.productId;
  }

  trackByCategory(index: number, category: Category): number {
    return category.categoryId;
  }

  // ⬇️ FUNZIONE AGGIUNTA PER L’IMMAGINE DELLA CATEGORIA
  getCategoryImage(name: string): string {
    switch (name.toLowerCase()) {
      case 'bikes':
        return 'assets/images/bike.png';
      case 'components':
        return 'assets/images/components.png';
      case 'clothing':
        return 'assets/images/clothing.png';
      case 'accessories':
        return 'assets/images/accessories.png';
      default:
        return 'assets/images/default.jpg';
    }
  }
}
