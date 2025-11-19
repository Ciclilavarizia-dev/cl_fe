import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainCategories } from './main-categories';

describe('MainCategories', () => {
  let component: MainCategories;
  let fixture: ComponentFixture<MainCategories>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MainCategories]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MainCategories);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
