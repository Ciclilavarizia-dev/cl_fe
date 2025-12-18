import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ɵInternalFormsSharedModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { AdminProductHttp } from '../../../../shared/services/admin/admin-product-http';
import { CommonModule } from '@angular/common';
import { forkJoin } from 'rxjs';
import { AdminCategory } from '../../../../shared/models/AdminCategory';
import { AdminProductModel } from '../../../../shared/models/AdminProductModel';

@Component({
  selector: 'app-edit-create-form',
  standalone: true,
  imports: [ɵInternalFormsSharedModule, ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './edit-create-form.html',
  styleUrl: './edit-create-form.css',
})
export class EditCreateForm {

  form!: FormGroup;

  productId?: number;
  isEditMode = false;

  // comes from backend
  hasOrders = false;

  categories: AdminCategory[] = [];
  models: AdminProductModel[] = [];

  productCategoryId: number | null = null;

  constructor(private route: ActivatedRoute, private fb: FormBuilder, private adminProductHttp: AdminProductHttp) { }

  ngOnInit() {
    this.productId = Number(this.route.snapshot.paramMap.get('id'));
    this.isEditMode = !!this.productId;

    this.buildForm();

    forkJoin({
      categories: this.adminProductHttp.getCategories(),
      models: this.adminProductHttp.getModels()
    }).subscribe(({ categories, models }) => {
      this.categories = categories;
      this.models = models;

      this.setupCategoryAutoSync();

      if (this.isEditMode) {
        this.loadProduct(this.productId!);
      }
    });
  }

  private buildForm() {
    this.form = this.fb.group({
      name: ['', Validators.required],
      productNumber: ['', Validators.required],
      categoryId: [null, Validators.required],
      // parentCategoryId: [{ value:null, disabled: true }],
      productModelId: [null],
    });
  }

  loadProduct(id: number) {
    this.adminProductHttp.getProduct(id).subscribe({
      next: product => {
        this.hasOrders = product.hasOrders;

        this.form.patchValue({
          name: product.name,
          productNumber: product.productNumber,
          categoryId: product.categoryId,
          productModelId: product.productModelId
        });

        if (product.hasOrders) {
          this.form.get('productNumber')?.disable();
        }
      }
    });
  }

  submit() {
    if (this.form.invalid) return;

    const payload = this.form.getRawValue();

    if (this.isEditMode) {

    } else {

    }
  }

  private setupCategoryAutoSync() {
    this.form.get('categoryId')?.valueChanges.subscribe(categoryId => {
      const category = this.categories.find(
        c => c.productCategoryId === categoryId
      );

      this.productCategoryId = category?.parentProductCategoryId ?? null;
    })
  }

}
