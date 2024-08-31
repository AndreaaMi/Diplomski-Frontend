import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserCardBalanceComponent } from './user-card-balance.component';

describe('UserCardBalanceComponent', () => {
  let component: UserCardBalanceComponent;
  let fixture: ComponentFixture<UserCardBalanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserCardBalanceComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UserCardBalanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
