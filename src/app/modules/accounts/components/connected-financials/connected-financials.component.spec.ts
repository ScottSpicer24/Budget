import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConnectedFinancialsComponent } from './connected-financials.component';

describe('ConnectedFinancialsComponent', () => {
  let component: ConnectedFinancialsComponent;
  let fixture: ComponentFixture<ConnectedFinancialsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConnectedFinancialsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConnectedFinancialsComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
