import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpenseCardComponent } from './expense-card.component';

describe('ExpenseCardComponent', () => {
  let component: ExpenseCardComponent;
  let fixture: ComponentFixture<ExpenseCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExpenseCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExpenseCardComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
