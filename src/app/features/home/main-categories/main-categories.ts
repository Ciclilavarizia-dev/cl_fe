import { Component } from '@angular/core';
import { Category } from '../../../shared/models/Category';
import { ProductHttp } from '../../../shared/services/product-http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main-categories',
  imports: [],
  templateUrl: './main-categories.html',
  styleUrl: './main-categories.css',
})
export class MainCategories {

  // Inizializzo l'array delle categorie
  featuredCategories: Category[] = [];

  // Inietto un servizio per fare richieste http sui prodotti
  constructor (private productHttp: ProductHttp, private router: Router) {}

  // ngOnInit() inizializza metodi API prima che le view vengano renderizzate
  ngOnInit() {
    this.loadCategories();
  }

  // Chiamo il servizio per recuperare (get) le categorie
  // E mapparle agli immagini tramite i nomi
  private loadCategories() {
    this.productHttp.GetFeaturedCategories().subscribe(
      (data) => {
        this.featuredCategories = data.map((c) => ({
          ...c,
          imageUrl: this.getCategoryImage(c.name),
        }));
      }
    );
  }

  private getCategoryImage(name: string): string {
    switch (name.toLowerCase()) {
      case 'bikes':
        return 'assets/images/bike-v2.png';
      case 'components':
        return 'assets/images/components-v2.png';
      case 'clothing':
        return 'assets/images/clothing-v2.png';
      case 'accessories':
        return 'assets/images/accessories-v2.png';
      default:
        return 'assets/images/default.jpg';
    }
  }

  trackByCategory(category: Category): number {
    return category.categoryId;
  }

  onCategoryClick(category: Category) {
    // Naviga alla pagina prodotti filtrati per categoria
    this.router.navigate(['/products', category.name.toLowerCase().replace(/\s+/g, '-')]);
  }

}
