import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateEmployeFormComponent } from './update-employe-form.component';

describe('UpdateEmployeFormComponent', () => {
  let component: UpdateEmployeFormComponent;
  let fixture: ComponentFixture<UpdateEmployeFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateEmployeFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UpdateEmployeFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
