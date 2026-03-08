import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpendingCardComponent } from './spending-card.component';

describe('SpendingCardComponent', () => {
  let component: SpendingCardComponent;
  let fixture: ComponentFixture<SpendingCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpendingCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SpendingCardComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
