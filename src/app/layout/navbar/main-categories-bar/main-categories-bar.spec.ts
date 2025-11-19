import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainCategoriesBar } from './main-categories-bar';

describe('MainCategoriesBar', () => {
  let component: MainCategoriesBar;
  let fixture: ComponentFixture<MainCategoriesBar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MainCategoriesBar]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MainCategoriesBar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
