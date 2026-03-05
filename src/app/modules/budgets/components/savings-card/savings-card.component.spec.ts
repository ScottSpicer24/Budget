import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SavingsCardComponent } from './savings-card.component';

describe('SavingsCardComponent', () => {
  let component: SavingsCardComponent;
  let fixture: ComponentFixture<SavingsCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SavingsCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SavingsCardComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
