import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SavingsGoalRowComponent } from './savings-goal-row.component';

describe('SavingsGoalRowComponent', () => {
  let component: SavingsGoalRowComponent;
  let fixture: ComponentFixture<SavingsGoalRowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SavingsGoalRowComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SavingsGoalRowComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
