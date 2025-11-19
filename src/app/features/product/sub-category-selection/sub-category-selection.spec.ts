import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubCategorySelection } from './sub-category-selection';

describe('SubCategorySelection', () => {
  let component: SubCategorySelection;
  let fixture: ComponentFixture<SubCategorySelection>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubCategorySelection]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubCategorySelection);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
