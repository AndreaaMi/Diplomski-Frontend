import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddShiftFormComponent } from './add-shift-form.component';

describe('AddShiftFormComponent', () => {
  let component: AddShiftFormComponent;
  let fixture: ComponentFixture<AddShiftFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddShiftFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddShiftFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
