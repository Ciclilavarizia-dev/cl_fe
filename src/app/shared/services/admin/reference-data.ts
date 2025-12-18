import { Injectable } from '@angular/core';
import { Observable, share, shareReplay } from 'rxjs';
import { AdminCategory } from '../../models/AdminCategory';
import { AdminProductModel } from '../../models/AdminProductModel';
import { AdminProductHttp } from './admin-product-http';

@Injectable({
  providedIn: 'root',
})
export class ReferenceData {
  private categories$?: Observable<AdminCategory[]>;
  private models$?: Observable<AdminProductModel[]>;

  constructor(private adminHttpProduct: AdminProductHttp) {}

  getCategories(): Observable<AdminCategory[]> {
    if (!this.categories$) {
      this.categories$ = this.adminHttpProduct.getCategories().pipe(
        shareReplay(1)
      );
    }
    return this.categories$;
  }

  getModels(): Observable<AdminProductModel[]> {
    if (!this.models$) {
      this.models$ = this.adminHttpProduct.getModels().pipe(
        shareReplay(1)
      );
    }
    return this.models$;
  }
}
