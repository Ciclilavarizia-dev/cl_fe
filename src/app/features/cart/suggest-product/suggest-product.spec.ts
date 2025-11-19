import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuggestProduct } from './suggest-product';

describe('SuggestProduct', () => {
  let component: SuggestProduct;
  let fixture: ComponentFixture<SuggestProduct>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SuggestProduct]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SuggestProduct);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
