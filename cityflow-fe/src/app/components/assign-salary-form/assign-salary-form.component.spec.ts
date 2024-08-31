import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignSalaryFormComponent } from './assign-salary-form.component';

describe('AssignSalaryFormComponent', () => {
  let component: AssignSalaryFormComponent;
  let fixture: ComponentFixture<AssignSalaryFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssignSalaryFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AssignSalaryFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
