import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusCardComponent } from './bus-card.component';

describe('BusCardComponent', () => {
  let component: BusCardComponent;
  let fixture: ComponentFixture<BusCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BusCardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BusCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
