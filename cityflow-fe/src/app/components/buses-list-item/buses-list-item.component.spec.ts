import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusesListItemComponent } from './buses-list-item.component';

describe('BusesListItemComponent', () => {
  let component: BusesListItemComponent;
  let fixture: ComponentFixture<BusesListItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BusesListItemComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BusesListItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
