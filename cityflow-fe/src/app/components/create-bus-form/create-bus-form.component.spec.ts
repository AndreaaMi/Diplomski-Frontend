import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateBusFormComponent } from './create-bus-form.component';

describe('CreateBusFormComponent', () => {
  let component: CreateBusFormComponent;
  let fixture: ComponentFixture<CreateBusFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateBusFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreateBusFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
