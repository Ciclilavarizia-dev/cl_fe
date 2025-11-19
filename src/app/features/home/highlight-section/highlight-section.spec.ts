import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HighlightSection } from './highlight-section';

describe('HighlightSection', () => {
  let component: HighlightSection;
  let fixture: ComponentFixture<HighlightSection>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HighlightSection]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HighlightSection);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
